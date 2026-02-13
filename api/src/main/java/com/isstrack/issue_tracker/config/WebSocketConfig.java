package com.isstrack.issue_tracker.config;

import com.isstrack.issue_tracker.domain.security.JwtService;
import com.isstrack.issue_tracker.domain.security.WebSocketAuthChannelInterceptor;
import com.isstrack.issue_tracker.domain.security.WebSocketHandshakeInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
  private final JwtService jwtService;
  private final boolean allowQueryToken;
  private final String allowedOrigins;

  public WebSocketConfig(
      JwtService jwtService,
      @Value("${websocket.auth.allow-query-token}") boolean allowQueryToken,
      @Value("${websocket.allowed-origins}") String allowedOrigins
  ) {
    this.jwtService = jwtService;
    this.allowQueryToken = allowQueryToken;
    this.allowedOrigins = allowedOrigins;
  }

  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    registry.enableSimpleBroker("/topic", "/queue");
    registry.setApplicationDestinationPrefixes("/app");
    registry.setUserDestinationPrefix("/user");
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/ws")
        .setAllowedOriginPatterns(allowedOrigins.split(","))
        .addInterceptors(new WebSocketHandshakeInterceptor(allowQueryToken));
  }

  @Override
  public void configureClientInboundChannel(ChannelRegistration registration) {
    registration.interceptors(new WebSocketAuthChannelInterceptor(jwtService, allowQueryToken));
  }
}
