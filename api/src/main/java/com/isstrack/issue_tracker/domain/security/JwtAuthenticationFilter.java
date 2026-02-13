package com.isstrack.issue_tracker.domain.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
  private final JwtService jwtService;

  public JwtAuthenticationFilter(JwtService jwtService) {
    this.jwtService = jwtService;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain
  ) throws ServletException, IOException {
    var header = request.getHeader("Authorization");
    if (header != null && header.startsWith("Bearer ")) {
      var token = header.substring(7);
      if (jwtService.validateToken(token)) {
        var userId = String.valueOf(jwtService.extractUserId(token));
        var role = jwtService.extractRole(token);
        var auth = new UsernamePasswordAuthenticationToken(
            userId,
            null,
            List.of(new SimpleGrantedAuthority("ROLE_" + role))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
      }
    }
    filterChain.doFilter(request, response);
  }
}
