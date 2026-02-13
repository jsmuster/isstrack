package com.isstrack.issue_tracker.persistence.repo;

import com.isstrack.issue_tracker.persistence.entity.UserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
  Optional<UserEntity> findByEmailIgnoreCase(String email);

  Optional<UserEntity> findByUsernameIgnoreCase(String username);

  Optional<UserEntity> findByEmailIgnoreCaseOrUsernameIgnoreCase(String email, String username);
}
