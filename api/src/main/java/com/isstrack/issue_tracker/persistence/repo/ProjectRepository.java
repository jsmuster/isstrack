package com.isstrack.issue_tracker.persistence.repo;

import com.isstrack.issue_tracker.persistence.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {
}
