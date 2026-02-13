package com.isstrack.issue_tracker.persistence.repo;

import com.isstrack.issue_tracker.persistence.entity.TagEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<TagEntity, Long> {
  Optional<TagEntity> findByNameIgnoreCase(String name);
}
