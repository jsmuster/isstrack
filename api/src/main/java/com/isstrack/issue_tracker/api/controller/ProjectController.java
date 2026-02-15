package com.isstrack.issue_tracker.api.controller;

import com.isstrack.issue_tracker.api.dto.AcceptInviteRequest;
import com.isstrack.issue_tracker.api.dto.CreateProjectRequest;
import com.isstrack.issue_tracker.api.dto.InviteMemberRequest;
import com.isstrack.issue_tracker.api.dto.MembershipDto;
import com.isstrack.issue_tracker.api.dto.PageResponse;
import com.isstrack.issue_tracker.api.dto.ProjectDto;
import com.isstrack.issue_tracker.domain.security.CurrentUser;
import com.isstrack.issue_tracker.domain.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
  private final ProjectService projectService;

  public ProjectController(ProjectService projectService) {
    this.projectService = projectService;
  }

  @PostMapping
  public ProjectDto createProject(@Valid @RequestBody CreateProjectRequest request) {
    long userId = CurrentUser.requireUserId();
    return projectService.createProject(userId, request.name(), request.prefix());
  }

  @GetMapping
  public PageResponse<ProjectDto> listProjects(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size
  ) {
    long userId = CurrentUser.requireUserId();
    Pageable pageable = com.isstrack.issue_tracker.domain.service.PaginationHelper.page(
        page,
        size,
        Sort.by("createdAt").descending()
    );
    return projectService.listMyProjects(userId, pageable);
  }

  @GetMapping("/{projectId}")
  public ProjectDto getProject(@PathVariable long projectId) {
    long userId = CurrentUser.requireUserId();
    return projectService.getProject(userId, projectId);
  }

  @PostMapping("/{projectId}/invites")
  public MembershipDto inviteMember(
      @PathVariable long projectId,
      @Valid @RequestBody InviteMemberRequest request
  ) {
    long userId = CurrentUser.requireUserId();
    return projectService.inviteMember(userId, projectId, request.email());
  }

  @GetMapping("/{projectId}/members")
  public PageResponse<MembershipDto> listMembers(
      @PathVariable long projectId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size
  ) {
    long userId = CurrentUser.requireUserId();
    Pageable pageable = com.isstrack.issue_tracker.domain.service.PaginationHelper.page(
        page,
        size,
        Sort.by("createdAt").descending()
    );
    return projectService.listMembers(userId, projectId, pageable);
  }

  @PostMapping("/invites/accept")
  public MembershipDto acceptInvite(@Valid @RequestBody AcceptInviteRequest request) {
    long userId = CurrentUser.requireUserId();
    return projectService.acceptInvite(userId, request.token());
  }
}
