package com.isstrack.issue_tracker.persistence.repo;

import com.isstrack.issue_tracker.persistence.entity.PriorityEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PriorityRepository extends JpaRepository<PriorityEntity, Short> {
  Optional<PriorityEntity> findByNameIgnoreCase(String name);
}
