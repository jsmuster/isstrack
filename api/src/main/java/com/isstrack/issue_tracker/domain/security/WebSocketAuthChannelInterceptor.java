package com.isstrack.issue_tracker.domain.security;

import java.security.Principal;
import java.util.List;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;

public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {
  private final JwtService jwtService;
  private final boolean allowQueryToken;

  public WebSocketAuthChannelInterceptor(JwtService jwtService, boolean allowQueryToken) {
    this.jwtService = jwtService;
    this.allowQueryToken = allowQueryToken;
  }

  @Override
  public Message<?> preSend(Message<?> message, MessageChannel channel) {
    StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
    if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
      String token = resolveToken(accessor);
      if (token == null || token.isBlank()) {
        throw new IllegalArgumentException("Missing Authorization token");
      }
      if (!jwtService.validateToken(token)) {
        throw new IllegalArgumentException("Invalid token");
      }
      var userId = String.valueOf(jwtService.extractUserId(token));
      accessor.setUser(new StompPrincipal(userId));
    }
    return message;
  }

  private String resolveToken(StompHeaderAccessor accessor) {
    List<String> authHeaders = accessor.getNativeHeader("Authorization");
    if (authHeaders != null && !authHeaders.isEmpty()) {
      String header = authHeaders.get(0);
      if (header.startsWith("Bearer ")) {
        return header.substring(7);
      }
    }
    if (!allowQueryToken) {
      return null;
    }
    var attributes = accessor.getSessionAttributes();
    if (attributes != null && attributes.get("wsToken") instanceof String token) {
      return token;
    }
    return null;
  }

  private record StompPrincipal(String name) implements Principal {
  }
}
