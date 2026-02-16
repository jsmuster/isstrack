/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.config;

import com.isstrack.issue_tracker.domain.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.isstrack.issue_tracker.domain.security.WebSocketAuthChannelInterceptor;
import com.isstrack.issue_tracker.domain.security.WebSocketHandshakeInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
  private static final Logger log = LoggerFactory.getLogger(WebSocketConfig.class);

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
    LifecycleLogger.startup(log, "WebSocketConfig initialized: allowQueryToken={}, allowedOrigins={}", allowQueryToken, allowedOrigins);
  }

  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    registry.enableSimpleBroker("/topic", "/queue")
        .setHeartbeatValue(new long[]{25000, 25000})
        .setTaskScheduler(brokerTaskScheduler());
    registry.setApplicationDestinationPrefixes("/app");
    registry.setUserDestinationPrefix("/user");
    LifecycleLogger.startup(log, "Message broker configured: topics=[/topic, /queue], appPrefix=/app, userPrefix=/user");
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/ws")
        .setAllowedOriginPatterns(allowedOrigins.split(","))
        .addInterceptors(new WebSocketHandshakeInterceptor(allowQueryToken));
    LifecycleLogger.startup(log, "STOMP endpoint registered: /ws, origins={}", allowedOrigins);
  }

  @Override
  public void configureClientInboundChannel(ChannelRegistration registration) {
    registration.interceptors(new WebSocketAuthChannelInterceptor(jwtService, allowQueryToken));
  }

  @Bean
  public TaskScheduler brokerTaskScheduler() {
    var scheduler = new ThreadPoolTaskScheduler();
    scheduler.setPoolSize(1);
    scheduler.setThreadNamePrefix("ws-heartbeat-");
    return scheduler;
  }
}

