/*
 * Ac Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.domain.service;

import com.isstrack.issue_tracker.config.LifecycleLogger;
import com.isstrack.issue_tracker.persistence.repo.PasswordResetTokenRepository;
import java.time.Duration;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PasswordResetCleanupJob {
  private static final Logger log = LoggerFactory.getLogger(PasswordResetCleanupJob.class);
  private static final Duration RETENTION = Duration.ofDays(1);

  private final PasswordResetTokenRepository tokenRepository;

  public PasswordResetCleanupJob(PasswordResetTokenRepository tokenRepository) {
    this.tokenRepository = tokenRepository;
  }

  @Scheduled(fixedDelayString = "PT1H")
  public void cleanupExpiredTokens() {
    Instant expiresBefore = Instant.now().minus(RETENTION);
    int deleted = tokenRepository.deleteExpired(expiresBefore);
    LifecycleLogger.scheduled(log, "Password reset cleanup removed {} tokens", deleted);
  }
}
