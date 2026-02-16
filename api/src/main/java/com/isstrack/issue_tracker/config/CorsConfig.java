/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {
  private static final Logger logger = LoggerFactory.getLogger(CorsConfig.class);

  @Bean
  public CorsConfigurationSource corsConfigurationSource(
      @Value("${websocket.allowed-origins}") String allowedOrigins,
      ObjectMapper objectMapper,
      ResourceLoader resourceLoader
  ) {
    var configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(resolveAllowedOrigins(allowedOrigins, objectMapper, resourceLoader));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    configuration.setAllowCredentials(true);
    var source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  private List<String> resolveAllowedOrigins(
      String allowedOrigins,
      ObjectMapper objectMapper,
      ResourceLoader resourceLoader
  ) {
    List<String> originList = new ArrayList<>();
    if (allowedOrigins != null && !allowedOrigins.isBlank()) {
      for (String origin : allowedOrigins.split(",")) {
        String trimmed = origin.trim();
        if (!trimmed.isBlank()) {
          originList.add(trimmed);
        }
      }
    }

    originList.addAll(loadOriginsFromConfig(objectMapper, resourceLoader));
    Set<String> uniqueOrigins = new LinkedHashSet<>(originList);
    return List.copyOf(uniqueOrigins);
  }

  private List<String> loadOriginsFromConfig(ObjectMapper objectMapper, ResourceLoader resourceLoader) {
    Resource resource = resourceLoader.getResource("classpath:cors_config.json");
    if (!resource.exists()) {
      return List.of();
    }

    try (InputStream inputStream = resource.getInputStream()) {
      CorsConfigFile configFile = objectMapper.readValue(inputStream, CorsConfigFile.class);
      if (configFile == null || configFile.allowedOrigins() == null) {
        return List.of();
      }
      return configFile.allowedOrigins().stream()
          .map(origin -> origin == null ? "" : origin.trim())
          .filter(origin -> !origin.isBlank())
          .toList();
    } catch (IOException ex) {
      logger.warn("Failed to read cors_config.json, falling back to property origins.", ex);
      return List.of();
    }
  }

  private record CorsConfigFile(List<String> allowedOrigins) {}
}

