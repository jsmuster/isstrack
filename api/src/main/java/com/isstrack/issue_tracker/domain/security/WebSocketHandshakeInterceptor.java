package com.isstrack.issue_tracker.domain.security;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

public class WebSocketHandshakeInterceptor implements HandshakeInterceptor {
  private final boolean allowQueryToken;

  public WebSocketHandshakeInterceptor(boolean allowQueryToken) {
    this.allowQueryToken = allowQueryToken;
  }

  @Override
  public boolean beforeHandshake(
      ServerHttpRequest request,
      ServerHttpResponse response,
      WebSocketHandler wsHandler,
      Map<String, Object> attributes
  ) {
    if (!allowQueryToken) {
      return true;
    }
    if (request instanceof ServletServerHttpRequest servletRequest) {
      HttpServletRequest httpServletRequest = servletRequest.getServletRequest();
      String token = httpServletRequest.getParameter("token");
      if (token != null && !token.isBlank()) {
        attributes.put("wsToken", token);
      }
    }
    return true;
  }

  @Override
  public void afterHandshake(
      ServerHttpRequest request,
      ServerHttpResponse response,
      WebSocketHandler wsHandler,
      Exception exception
  ) {
  }
}
