package com.isstrack.issue_tracker.domain.service;

import com.isstrack.issue_tracker.api.dto.MembershipDto;
import com.isstrack.issue_tracker.api.dto.PageResponse;
import com.isstrack.issue_tracker.api.dto.ProjectDto;
import com.isstrack.issue_tracker.api.error.NotFoundException;
import com.isstrack.issue_tracker.domain.event.MemberAddedEvent;
import com.isstrack.issue_tracker.domain.mapper.EntityMapper;
import com.isstrack.issue_tracker.domain.model.MembershipStatus;
import com.isstrack.issue_tracker.domain.model.ProjectRole;
import com.isstrack.issue_tracker.persistence.entity.ProjectEntity;
import com.isstrack.issue_tracker.persistence.entity.ProjectMembershipEntity;
import com.isstrack.issue_tracker.persistence.repo.ProjectMembershipRepository;
import com.isstrack.issue_tracker.persistence.repo.ProjectRepository;
import com.isstrack.issue_tracker.persistence.repo.UserRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Locale;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {
  private static final Logger log = LoggerFactory.getLogger(ProjectService.class);
  private final ProjectRepository projectRepository;
  private final ProjectMembershipRepository membershipRepository;
  private final UserRepository userRepository;
  private final ProjectAccessService accessService;
  private final ApplicationEventPublisher eventPublisher;

  public ProjectService(
      ProjectRepository projectRepository,
      ProjectMembershipRepository membershipRepository,
      UserRepository userRepository,
      ProjectAccessService accessService,
      ApplicationEventPublisher eventPublisher
  ) {
    this.projectRepository = projectRepository;
    this.membershipRepository = membershipRepository;
    this.userRepository = userRepository;
    this.accessService = accessService;
    this.eventPublisher = eventPublisher;
  }

  @Transactional
  public ProjectDto createProject(long ownerId, String name) {
    var owner = userRepository.findById(ownerId)
        .orElseThrow(() -> new NotFoundException("User not found"));
    var project = new ProjectEntity();
    project.setName(name.trim());
    project.setOwner(owner);
    var saved = projectRepository.save(project);

    var membership = new ProjectMembershipEntity();
    membership.setProject(saved);
    membership.setUser(owner);
    membership.setRole(ProjectRole.OWNER.name());
    membership.setStatus(MembershipStatus.ACTIVE.name());
    membership.setInviter(owner);
    var membershipSaved = membershipRepository.save(membership);
    var membershipDto = EntityMapper.toMembershipDto(membershipSaved);
    eventPublisher.publishEvent(new MemberAddedEvent(saved.getId(), membershipDto, Instant.now()));
    log.info("Created project {}", saved.getId());
    return EntityMapper.toProjectDto(saved);
  }

  public PageResponse<ProjectDto> listMyProjects(long userId, Pageable pageable) {
    var page = membershipRepository.findByUserIdAndStatus(userId, MembershipStatus.ACTIVE.name(), pageable);
    var items = page.stream()
        .map(ProjectMembershipEntity::getProject)
        .map(EntityMapper::toProjectDto)
        .toList();
    return new PageResponse<>(items, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages());
  }

  public ProjectDto getProject(long userId, long projectId) {
    accessService.requireActiveMember(userId, projectId);
    var project = projectRepository.findById(projectId)
        .orElseThrow(() -> new NotFoundException("Project not found"));
    return EntityMapper.toProjectDto(project);
  }

  public PageResponse<MembershipDto> listMembers(long userId, long projectId, Pageable pageable) {
    accessService.requireActiveMember(userId, projectId);
    var page = membershipRepository.findByProjectIdAndStatus(projectId, MembershipStatus.ACTIVE.name(), pageable);
    var items = page.stream().map(EntityMapper::toMembershipDto).toList();
    return new PageResponse<>(items, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages());
  }

  @Transactional
  public MembershipDto inviteMember(long userId, long projectId, String email) {
    accessService.requireOwner(userId, projectId);
    var normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
    var project = projectRepository.findById(projectId)
        .orElseThrow(() -> new NotFoundException("Project not found"));
    var inviter = userRepository.findById(userId)
        .orElseThrow(() -> new NotFoundException("User not found"));

    var existingInvite = membershipRepository.findByProjectIdAndInvitedEmailIgnoreCaseAndStatus(
        projectId,
        normalizedEmail,
        MembershipStatus.INVITED.name()
    );
    if (existingInvite.isPresent()) {
      var invite = existingInvite.get();
      if (invite.getInviteExpiresAt() != null && invite.getInviteExpiresAt().isAfter(Instant.now())) {
        return EntityMapper.toMembershipDto(invite);
      }
    }

    var existingUser = userRepository.findByEmailIgnoreCase(normalizedEmail);
    if (existingUser.isPresent()) {
      var user = existingUser.get();
      var active = membershipRepository.findByProjectIdAndUserIdAndStatus(
          projectId,
          user.getId(),
          MembershipStatus.ACTIVE.name()
      );
      if (active.isPresent()) {
        return EntityMapper.toMembershipDto(active.get());
      }
      var membership = new ProjectMembershipEntity();
      membership.setProject(project);
      membership.setUser(user);
      membership.setRole(ProjectRole.MEMBER.name());
      membership.setStatus(MembershipStatus.ACTIVE.name());
      membership.setInviter(inviter);
      var saved = membershipRepository.save(membership);
      var dto = EntityMapper.toMembershipDto(saved);
      eventPublisher.publishEvent(new MemberAddedEvent(projectId, dto, Instant.now()));
      return dto;
    }

    var membership = new ProjectMembershipEntity();
    membership.setProject(project);
    membership.setInvitedEmail(normalizedEmail);
    membership.setRole(ProjectRole.MEMBER.name());
    membership.setStatus(MembershipStatus.INVITED.name());
    membership.setInviter(inviter);
    membership.setInviteToken(UUID.randomUUID().toString());
    membership.setInviteExpiresAt(Instant.now().plus(7, ChronoUnit.DAYS));
    var saved = membershipRepository.save(membership);
    return EntityMapper.toMembershipDto(saved);
  }

  @Transactional
  public MembershipDto acceptInvite(long userId, String token) {
    var membership = membershipRepository.findByInviteToken(token)
        .orElseThrow(() -> new NotFoundException("Invite not found"));
    var user = userRepository.findById(userId)
        .orElseThrow(() -> new NotFoundException("User not found"));
    if (membership.getInvitedEmail() != null
        && !membership.getInvitedEmail().equalsIgnoreCase(user.getEmail())) {
      throw new com.isstrack.issue_tracker.api.error.BadRequestException("Invite email does not match user");
    }
    membership.setUser(user);
    membership.setStatus(MembershipStatus.ACTIVE.name());
    membership.setInviteToken(null);
    membership.setInviteExpiresAt(null);
    var saved = membershipRepository.save(membership);
    var dto = EntityMapper.toMembershipDto(saved);
    eventPublisher.publishEvent(new MemberAddedEvent(saved.getProject().getId(), dto, Instant.now()));
    return dto;
  }
}
