/*
 * Ac Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.domain.service;

import com.isstrack.issue_tracker.api.error.BadRequestException;
import com.isstrack.issue_tracker.api.error.ResetTokenInvalidOrExpiredException;
import com.isstrack.issue_tracker.persistence.entity.PasswordResetTokenEntity;
import com.isstrack.issue_tracker.persistence.entity.UserEntity;
import com.isstrack.issue_tracker.persistence.repo.PasswordResetTokenRepository;
import com.isstrack.issue_tracker.persistence.repo.UserRepository;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PasswordResetService {
  private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);
  private static final Duration TOKEN_TTL = Duration.ofMinutes(15);
  private static final Duration RESEND_THROTTLE = Duration.ofSeconds(60);
  private static final int TOKEN_BYTES = 32;

  private final PasswordResetTokenRepository tokenRepository;
  private final UserRepository userRepository;
  private final PasswordResetTokenHasher tokenHasher;
  private final PasswordEncoder passwordEncoder;
  private final EmailService emailService;
  private final SecureRandom secureRandom = new SecureRandom();
  private final String frontendBaseUrl;

  public PasswordResetService(
      PasswordResetTokenRepository tokenRepository,
      UserRepository userRepository,
      PasswordResetTokenHasher tokenHasher,
      PasswordEncoder passwordEncoder,
      EmailService emailService,
      @Value("${app.frontend.base-url:http://localhost:4200}") String frontendBaseUrl
  ) {
    this.tokenRepository = tokenRepository;
    this.userRepository = userRepository;
    this.tokenHasher = tokenHasher;
    this.passwordEncoder = passwordEncoder;
    this.emailService = emailService;
    this.frontendBaseUrl = frontendBaseUrl;
  }

  @Transactional
  public void requestReset(String email, String ip, String userAgent) {
    createTokenIfEligible(email, ip, userAgent, false);
  }

  @Transactional
  public void resendReset(String email, String ip, String userAgent) {
    createTokenIfEligible(email, ip, userAgent, true);
  }

  public void validateTokenOrThrow(String rawToken) {
    String tokenHash = tokenHasher.sha256Hex(rawToken);
    tokenRepository.findActiveByTokenHash(tokenHash, Instant.now())
        .orElseThrow(() -> new ResetTokenInvalidOrExpiredException("Reset token expired"));
  }

  @Transactional
  public void resetPassword(String rawToken, String newPassword) {
    enforcePasswordPolicy(newPassword);
    String tokenHash = tokenHasher.sha256Hex(rawToken);
    PasswordResetTokenEntity token = tokenRepository.findActiveByTokenHash(tokenHash, Instant.now())
        .orElseThrow(() -> new ResetTokenInvalidOrExpiredException("Reset token expired"));
    Instant now = Instant.now();
    tokenRepository.markConsumed(token.getId(), now);
    UserEntity user = userRepository.findById(token.getUserId())
        .orElseThrow(() -> new ResetTokenInvalidOrExpiredException("Reset token invalid"));
    user.setPasswordHash(passwordEncoder.encode(newPassword));
    userRepository.save(user);
    tokenRepository.invalidateActiveForUser(user.getId(), now);
  }

  private void createTokenIfEligible(String email, String ip, String userAgent, boolean enforceThrottle) {
    if (email == null) {
      return;
    }

    String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
    if (normalizedEmail.isBlank()) {
      return;
    }

    userRepository.findByEmailIgnoreCase(normalizedEmail)
        .filter(UserEntity::isActive)
        .ifPresent(user -> {
          Instant now = Instant.now();
          if (enforceThrottle && tokenRepository.countRecentForUser(user.getId(), now.minus(RESEND_THROTTLE)) > 0) {
            log.info("Password reset throttled for user {}", user.getId());
            return;
          }
          tokenRepository.invalidateActiveForUser(user.getId(), now);
          String rawToken = generateToken();
          String tokenHash = tokenHasher.sha256Hex(rawToken);
          PasswordResetTokenEntity token = new PasswordResetTokenEntity();
          token.setUserId(user.getId());
          token.setTokenHash(tokenHash);
          token.setCreatedAt(now);
          token.setExpiresAt(now.plus(TOKEN_TTL));
          token.setRequestIp(ip);
          token.setUserAgent(userAgent);
          tokenRepository.save(token);
          String link = String.format("%s/set-a-new-password?token=%s", frontendBaseUrl, rawToken);
          emailService.sendPasswordResetEmail(user.getEmail(), link, token.getExpiresAt());
          log.info("Password reset token issued for user {}", user.getId());
        });
  }

  private String generateToken() {
    byte[] bytes = new byte[TOKEN_BYTES];
    secureRandom.nextBytes(bytes);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  }

  private void enforcePasswordPolicy(String newPassword) {
    if (newPassword == null || newPassword.isBlank()) {
      throw new BadRequestException("Password is required");
    }
    if (newPassword.length() < 8) {
      throw new BadRequestException("Password must be at least 8 characters");
    }
    boolean hasUpper = newPassword.chars().anyMatch(Character::isUpperCase);
    boolean hasLower = newPassword.chars().anyMatch(Character::isLowerCase);
    boolean hasDigit = newPassword.chars().anyMatch(Character::isDigit);
    boolean hasSymbol = newPassword.chars().anyMatch(ch -> !Character.isLetterOrDigit(ch));
    if (!(hasUpper && hasLower && hasDigit && hasSymbol)) {
      throw new BadRequestException("Password must include upper, lower, number, and symbol");
    }
  }
}
