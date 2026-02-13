package com.isstrack.issue_tracker.domain.service;

import com.isstrack.issue_tracker.api.dto.IssueDto;
import com.isstrack.issue_tracker.api.dto.PageResponse;
import com.isstrack.issue_tracker.domain.mapper.EntityMapper;
import com.isstrack.issue_tracker.persistence.entity.IssueEntity;
import com.isstrack.issue_tracker.persistence.repo.IssueRepository;
import com.isstrack.issue_tracker.persistence.repo.IssueTagRepository;
import com.isstrack.issue_tracker.persistence.spec.IssueSpecifications;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class IssueQueryService {
  private final IssueRepository issueRepository;
  private final IssueTagRepository issueTagRepository;
  private final ProjectAccessService accessService;

  public IssueQueryService(
      IssueRepository issueRepository,
      IssueTagRepository issueTagRepository,
      ProjectAccessService accessService
  ) {
    this.issueRepository = issueRepository;
    this.issueTagRepository = issueTagRepository;
    this.accessService = accessService;
  }

  public PageResponse<IssueDto> listIssues(
      long userId,
      long projectId,
      String status,
      String priority,
      Long assigneeId,
      String tag,
      String query,
      Pageable pageable
  ) {
    accessService.requireActiveMember(userId, projectId);
    Specification<IssueEntity> spec = IssueSpecifications.byProjectId(projectId);
    if (status != null && !status.isBlank()) {
      spec = spec.and(IssueSpecifications.byStatusName(status));
    }
    if (priority != null && !priority.isBlank()) {
      spec = spec.and(IssueSpecifications.byPriorityName(priority));
    }
    if (assigneeId != null) {
      spec = spec.and(IssueSpecifications.byAssigneeId(assigneeId));
    }
    if (tag != null && !tag.isBlank()) {
      spec = spec.and(IssueSpecifications.byTagName(tag));
    }
    if (query != null && !query.isBlank()) {
      spec = spec.and(IssueSpecifications.byTitleQuery(query.trim()));
    }

    Page<IssueEntity> page = issueRepository.findAll(spec, pageable);
    List<Long> issueIds = page.stream().map(IssueEntity::getId).toList();
    Map<Long, List<String>> tagMap = loadTags(issueIds);
    List<IssueDto> items = new ArrayList<>();
    for (IssueEntity issue : page) {
      var tags = tagMap.getOrDefault(issue.getId(), List.of());
      items.add(EntityMapper.toIssueDto(issue, tags));
    }
    return new PageResponse<>(items, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages());
  }

  private Map<Long, List<String>> loadTags(List<Long> issueIds) {
    Map<Long, List<String>> tagMap = new HashMap<>();
    if (issueIds.isEmpty()) {
      return tagMap;
    }
    for (Object[] row : issueTagRepository.findIssueTagsByIssueIds(issueIds)) {
      Long issueId = (Long) row[0];
      String tag = Objects.toString(row[1]);
      tagMap.computeIfAbsent(issueId, key -> new ArrayList<>()).add(tag);
    }
    return tagMap;
  }
}
