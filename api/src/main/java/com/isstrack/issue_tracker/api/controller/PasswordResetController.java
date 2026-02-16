/*
 * Ac Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.api.controller;

import com.isstrack.issue_tracker.api.dto.ForgotPasswordRequest;
import com.isstrack.issue_tracker.api.dto.GenericOkResponse;
import com.isstrack.issue_tracker.api.dto.ResendForgotPasswordRequest;
import com.isstrack.issue_tracker.api.dto.ResetPasswordRequest;
import com.isstrack.issue_tracker.domain.service.PasswordResetService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {
  private final PasswordResetService passwordResetService;

  public PasswordResetController(PasswordResetService passwordResetService) {
    this.passwordResetService = passwordResetService;
  }

  @PostMapping("/forgot-password")
  public GenericOkResponse forgotPassword(
      @Valid @RequestBody ForgotPasswordRequest request,
      HttpServletRequest httpServletRequest
  ) {
    passwordResetService.requestReset(
        request.email(),
        httpServletRequest.getRemoteAddr(),
        httpServletRequest.getHeader("User-Agent")
    );
    return GenericOkResponse.ok();
  }

  @PostMapping("/forgot-password/resend")
  public GenericOkResponse resendForgotPassword(
      @Valid @RequestBody ResendForgotPasswordRequest request,
      HttpServletRequest httpServletRequest
  ) {
    passwordResetService.resendReset(
        request.email(),
        httpServletRequest.getRemoteAddr(),
        httpServletRequest.getHeader("User-Agent")
    );
    return GenericOkResponse.ok();
  }

  @GetMapping("/reset-password/validate")
  public GenericOkResponse validate(@RequestParam("token") String token) {
    passwordResetService.validateTokenOrThrow(token);
    return GenericOkResponse.ok();
  }

  @PostMapping("/reset-password")
  public GenericOkResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
    passwordResetService.resetPassword(request.token(), request.newPassword());
    return GenericOkResponse.ok();
  }
}
