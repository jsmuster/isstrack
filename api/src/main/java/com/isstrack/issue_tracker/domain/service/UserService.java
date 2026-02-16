/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.domain.service;

import com.isstrack.issue_tracker.api.dto.RegisterRequest;
import com.isstrack.issue_tracker.api.error.BadRequestException;
import com.isstrack.issue_tracker.api.error.NotFoundException;
import com.isstrack.issue_tracker.persistence.entity.UserEntity;
import com.isstrack.issue_tracker.persistence.repo.RoleRepository;
import com.isstrack.issue_tracker.persistence.repo.UserRepository;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
  private static final Logger log = LoggerFactory.getLogger(UserService.class);
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Transactional
  public UserEntity createUser(RegisterRequest request) {
    var email = request.email().trim().toLowerCase(Locale.ROOT);
    var username = request.username().trim();
    if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
      throw new BadRequestException("Email already in use");
    }
    if (userRepository.findByUsernameIgnoreCase(username).isPresent()) {
      throw new BadRequestException("Username already in use");
    }
    var role = roleRepository.findById((short) 2)
        .orElseThrow(() -> new NotFoundException("Role not found"));
    var user = new UserEntity();
    user.setEmail(email);
    user.setUsername(username);
    user.setPasswordHash(passwordEncoder.encode(request.password()));
    user.setFirstName(request.firstName());
    user.setLastName(request.lastName());
    user.setRole(role);
    user.setActive(true);
    var saved = userRepository.save(user);
    log.info("Registered user {}", saved.getId());
    return saved;
  }

  public UserEntity findById(long userId) {
    return userRepository.findById(userId)
        .orElseThrow(() -> new NotFoundException("User not found"));
  }

  public UserEntity findByEmailOrUsername(String identifier) {
    return userRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase(identifier, identifier)
        .orElseThrow(() -> new NotFoundException("User not found"));
  }
}

