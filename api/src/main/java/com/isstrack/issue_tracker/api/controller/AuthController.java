/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.api.controller;

import com.isstrack.issue_tracker.api.dto.AuthResponse;
import com.isstrack.issue_tracker.api.dto.LoginRequest;
import com.isstrack.issue_tracker.api.dto.RegisterRequest;
import com.isstrack.issue_tracker.domain.mapper.EntityMapper;
import com.isstrack.issue_tracker.domain.security.CurrentUser;
import com.isstrack.issue_tracker.domain.security.JwtService;
import com.isstrack.issue_tracker.domain.service.UserService;
import com.isstrack.issue_tracker.api.error.UnauthorizedException;
import com.isstrack.issue_tracker.persistence.repo.UserRepository;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private static final Logger log = LoggerFactory.getLogger(AuthController.class);
  private final UserService userService;
  private final JwtService jwtService;
  private final PasswordEncoder passwordEncoder;
  private final UserRepository userRepository;

  public AuthController(
      UserService userService,
      JwtService jwtService,
      PasswordEncoder passwordEncoder,
      UserRepository userRepository
  ) {
    this.userService = userService;
    this.jwtService = jwtService;
    this.passwordEncoder = passwordEncoder;
    this.userRepository = userRepository;
  }

  @PostMapping("/register")
  @Transactional
  public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
    var user = userService.createUser(request);
    var token = jwtService.generateToken(user);
    return new AuthResponse(token, EntityMapper.toUserDto(user));
  }

  @PostMapping("/login")
  @Transactional(readOnly = true)
  public AuthResponse login(@Valid @RequestBody LoginRequest request) {
    var user = userRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase(
            request.usernameOrEmail(),
            request.usernameOrEmail()
        )
        .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new UnauthorizedException("Invalid credentials");
    }
    log.info("User login {}", user.getId());
    var token = jwtService.generateToken(user);
    return new AuthResponse(token, EntityMapper.toUserDto(user));
  }

  @GetMapping("/me")
  public com.isstrack.issue_tracker.api.dto.UserDto me() {
    var userId = CurrentUser.requireUserId();
    return EntityMapper.toUserDto(userService.findById(userId));
  }
}

