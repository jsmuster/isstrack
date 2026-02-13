package com.isstrack.issue_tracker.domain.security;

import com.isstrack.issue_tracker.api.error.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class CurrentUser {
  private CurrentUser() {
  }

  public static long requireUserId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || authentication.getName() == null) {
      throw new UnauthorizedException("Unauthorized");
    }
    try {
      return Long.parseLong(authentication.getName());
    } catch (NumberFormatException ex) {
      throw new UnauthorizedException("Unauthorized");
    }
  }
}
