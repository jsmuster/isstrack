/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.domain.security;

import com.isstrack.issue_tracker.config.LifecycleLogger;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

public class WebSocketHandshakeInterceptor implements HandshakeInterceptor {
  private static final Logger log = LoggerFactory.getLogger(WebSocketHandshakeInterceptor.class);
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
    LifecycleLogger.websocket(log, "WebSocket handshake attempt from {}", request.getRemoteAddress());
    if (!allowQueryToken) {
      return true;
    }
    if (request instanceof ServletServerHttpRequest servletRequest) {
      HttpServletRequest httpServletRequest = servletRequest.getServletRequest();
      String token = httpServletRequest.getParameter("token");
      if (token != null && !token.isBlank()) {
        attributes.put("wsToken", token);
        LifecycleLogger.websocket(log, "WebSocket query token captured for handshake");
      }
    }
    LifecycleLogger.websocket(log, "WebSocket handshake accepted");
    return true;
  }

  @Override
  public void afterHandshake(
      ServerHttpRequest request,
      ServerHttpResponse response,
      WebSocketHandler wsHandler,
      Exception exception
  ) {
    LifecycleLogger.websocket(log, "WebSocket handshake completed, exception={}", exception != null ? exception.getMessage() : "none");
  }
}

