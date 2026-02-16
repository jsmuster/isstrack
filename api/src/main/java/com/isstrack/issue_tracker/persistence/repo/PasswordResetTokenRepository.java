/*
 * Ac Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.persistence.repo;

import com.isstrack.issue_tracker.persistence.entity.PasswordResetTokenEntity;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetTokenEntity, Long> {
  @Query("""
      SELECT token FROM PasswordResetTokenEntity token
      WHERE token.tokenHash = :tokenHash
        AND token.consumedAt IS NULL
        AND token.expiresAt > :now
      """)
  Optional<PasswordResetTokenEntity> findActiveByTokenHash(
      @Param("tokenHash") String tokenHash,
      @Param("now") Instant now
  );

  @Modifying
  @Query("""
      UPDATE PasswordResetTokenEntity token
      SET token.consumedAt = :consumedAt
      WHERE token.id = :id AND token.consumedAt IS NULL
      """)
  int markConsumed(@Param("id") Long id, @Param("consumedAt") Instant consumedAt);

  @Modifying
  @Query("""
      UPDATE PasswordResetTokenEntity token
      SET token.consumedAt = :consumedAt
      WHERE token.userId = :userId AND token.consumedAt IS NULL
      """)
  int invalidateActiveForUser(@Param("userId") Long userId, @Param("consumedAt") Instant consumedAt);

  @Query("""
      SELECT COUNT(token) FROM PasswordResetTokenEntity token
      WHERE token.userId = :userId AND token.createdAt >= :since
      """)
  long countRecentForUser(@Param("userId") Long userId, @Param("since") Instant since);

  @Modifying
  @Query("""
      DELETE FROM PasswordResetTokenEntity token
      WHERE token.expiresAt < :expiresBefore
      """)
  int deleteExpired(@Param("expiresBefore") Instant expiresBefore);
}
