/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.persistence.repo;

import com.isstrack.issue_tracker.persistence.entity.StatusEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusRepository extends JpaRepository<StatusEntity, Short> {
  Optional<StatusEntity> findByNameIgnoreCase(String name);
}

