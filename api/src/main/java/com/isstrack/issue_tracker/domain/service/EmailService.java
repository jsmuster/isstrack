/*
 * Ac Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.domain.service;

import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
  private static final Logger log = LoggerFactory.getLogger(EmailService.class);

  public void sendPasswordResetEmail(String email, String link, Instant expiresAt) {
    log.info("Password reset email queued for {} with expiry {}", email, expiresAt);
    log.info("Password reset link: {}", link);
  }
}
