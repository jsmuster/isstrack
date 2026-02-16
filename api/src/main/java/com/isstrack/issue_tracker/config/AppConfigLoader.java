/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.config;

import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public final class AppConfigLoader {
  private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
  private static final String DEFAULT_CONFIG_PATH = "/app/config.json";

  private AppConfigLoader() {}

  public static LoadedConfig load() {
    String configPath =
        System.getenv().getOrDefault("APP_CONFIG_PATH", DEFAULT_CONFIG_PATH);

    try {
      Path path = Path.of(configPath);
      if (!Files.exists(path)) {
        return new LoadedConfig(Collections.emptyMap(), null);
      }

      OBJECT_MAPPER.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
      ConfigFile configFile = OBJECT_MAPPER.readValue(path.toFile(), ConfigFile.class);
      if (configFile == null || configFile.database == null) {
        return new LoadedConfig(Collections.emptyMap(), configFile);
      }

      DatabaseConfig database = configFile.database;
      Map<String, Object> properties = new HashMap<>();
      properties.put(
          "spring.datasource.url",
          String.format(
              "jdbc:postgresql://%s:%d/%s",
              database.host, database.port, database.database));
      properties.put("spring.datasource.username", database.username);
      properties.put("spring.datasource.password", database.password);
      return new LoadedConfig(properties, configFile);
    } catch (Exception ex) {
      System.err.println("Failed to load APP_CONFIG_PATH config: " + ex.getMessage());
      return new LoadedConfig(Collections.emptyMap(), null);
    }
  }

  public static final class LoadedConfig {
    private final Map<String, Object> properties;
    private final ConfigFile configFile;

    private LoadedConfig(Map<String, Object> properties, ConfigFile configFile) {
      this.properties = properties;
      this.configFile = configFile;
    }

    public Map<String, Object> getProperties() {
      return properties;
    }

    public ConfigFile getConfigFile() {
      return configFile;
    }
  }

  public static final class ConfigFile {
    public DatabaseConfig database;
    public ServiceConfig service;
    public LoggingConfig logging;
    public SecurityConfig security;
    public WebsocketConfig websocket;
    public DiagnosticsConfig diagnostics;
    public MemoryBudgetConfig memoryBudget;
    public LifecycleLoggingConfig lifecycleLogging;

    public void setDatabase(DatabaseConfig database) {
      this.database = database;
    }

    public void setService(ServiceConfig service) {
      this.service = service;
    }

    public void setLogging(LoggingConfig logging) {
      this.logging = logging;
    }

    public void setSecurity(SecurityConfig security) {
      this.security = security;
    }

    public void setWebsocket(WebsocketConfig websocket) {
      this.websocket = websocket;
    }

    public void setDiagnostics(DiagnosticsConfig diagnostics) {
      this.diagnostics = diagnostics;
    }

    public void setMemoryBudget(MemoryBudgetConfig memoryBudget) {
      this.memoryBudget = memoryBudget;
    }

    public void setLifecycleLogging(LifecycleLoggingConfig lifecycleLogging) {
      this.lifecycleLogging = lifecycleLogging;
    }
  }

  public static final class DatabaseConfig {
    public String host;
    public int port;
    public String username;
    public String password;
    public String database;

    public void setHost(String host) {
      this.host = host;
    }

    public void setPort(int port) {
      this.port = port;
    }

    public void setUsername(String username) {
      this.username = username;
    }

    public void setPassword(String password) {
      this.password = password;
    }

    public void setDatabase(String database) {
      this.database = database;
    }
  }

  public static final class ServiceConfig {
    public String name;
    public String environment;
    public String externalUrl;
    public boolean enableOpenInView;

    public void setName(String name) {
      this.name = name;
    }

    public void setEnvironment(String environment) {
      this.environment = environment;
    }

    public void setExternalUrl(String externalUrl) {
      this.externalUrl = externalUrl;
    }

    public void setEnableOpenInView(boolean enableOpenInView) {
      this.enableOpenInView = enableOpenInView;
    }
  }

  public static final class LoggingConfig {
    public String level;

    public void setLevel(String level) {
      this.level = level;
    }
  }

  public static final class SecurityConfig {
    public String jwtIssuer;
    public int jwtExpirationMinutes;

    public void setJwtIssuer(String jwtIssuer) {
      this.jwtIssuer = jwtIssuer;
    }

    public void setJwtExpirationMinutes(int jwtExpirationMinutes) {
      this.jwtExpirationMinutes = jwtExpirationMinutes;
    }
  }

  public static final class WebsocketConfig {
    public String[] allowedOrigins;
    public boolean allowQueryToken;

    public void setAllowedOrigins(String[] allowedOrigins) {
      this.allowedOrigins = allowedOrigins;
    }

    public void setAllowQueryToken(boolean allowQueryToken) {
      this.allowQueryToken = allowQueryToken;
    }
  }

  public static final class DiagnosticsConfig {
    public int memoryLogIntervalSeconds;
    public boolean enableMemoryLogging;
    public boolean enableGcStats;
    public boolean enableMemoryCleanup;
    public int memoryCleanupIntervalSeconds;
    public int memoryCleanupThresholdMb;

    public void setMemoryLogIntervalSeconds(int memoryLogIntervalSeconds) {
      this.memoryLogIntervalSeconds = memoryLogIntervalSeconds;
    }

    public void setEnableMemoryLogging(boolean enableMemoryLogging) {
      this.enableMemoryLogging = enableMemoryLogging;
    }

    public void setEnableGcStats(boolean enableGcStats) {
      this.enableGcStats = enableGcStats;
    }

    public void setEnableMemoryCleanup(boolean enableMemoryCleanup) {
      this.enableMemoryCleanup = enableMemoryCleanup;
    }

    public void setMemoryCleanupIntervalSeconds(int memoryCleanupIntervalSeconds) {
      this.memoryCleanupIntervalSeconds = memoryCleanupIntervalSeconds;
    }

    public void setMemoryCleanupThresholdMb(int memoryCleanupThresholdMb) {
      this.memoryCleanupThresholdMb = memoryCleanupThresholdMb;
    }
  }

  public static final class MemoryBudgetConfig {
    public boolean enabled;
    public int targetWorkingSetMb;
    public int gcHeapHardLimitMb;
    public int memoryCacheSizeLimitMb;
    public int promptCacheLimitMb;
    public int promptMlCacheLimitMb;
    public int maxLoggedPayloadBytesPerOperation;

    public void setEnabled(boolean enabled) {
      this.enabled = enabled;
    }

    public void setTargetWorkingSetMb(int targetWorkingSetMb) {
      this.targetWorkingSetMb = targetWorkingSetMb;
    }

    public void setGcHeapHardLimitMb(int gcHeapHardLimitMb) {
      this.gcHeapHardLimitMb = gcHeapHardLimitMb;
    }

    public void setMemoryCacheSizeLimitMb(int memoryCacheSizeLimitMb) {
      this.memoryCacheSizeLimitMb = memoryCacheSizeLimitMb;
    }

    public void setPromptCacheLimitMb(int promptCacheLimitMb) {
      this.promptCacheLimitMb = promptCacheLimitMb;
    }

    public void setPromptMlCacheLimitMb(int promptMlCacheLimitMb) {
      this.promptMlCacheLimitMb = promptMlCacheLimitMb;
    }

    public void setMaxLoggedPayloadBytesPerOperation(int maxLoggedPayloadBytesPerOperation) {
      this.maxLoggedPayloadBytesPerOperation = maxLoggedPayloadBytesPerOperation;
    }
  }

  public static final class LifecycleLoggingConfig {
    public boolean enabled;
    public boolean logStartupPhases;
    public boolean logRequests;
    public boolean logSecurity;
    public boolean logWebSocket;
    public boolean logDatabase;
    public boolean logScheduledTasks;
    public boolean logShutdown;

    public void setEnabled(boolean enabled) {
      this.enabled = enabled;
    }

    public void setLogStartupPhases(boolean logStartupPhases) {
      this.logStartupPhases = logStartupPhases;
    }

    public void setLogRequests(boolean logRequests) {
      this.logRequests = logRequests;
    }

    public void setLogSecurity(boolean logSecurity) {
      this.logSecurity = logSecurity;
    }

    public void setLogWebSocket(boolean logWebSocket) {
      this.logWebSocket = logWebSocket;
    }

    public void setLogDatabase(boolean logDatabase) {
      this.logDatabase = logDatabase;
    }

    public void setLogScheduledTasks(boolean logScheduledTasks) {
      this.logScheduledTasks = logScheduledTasks;
    }

    public void setLogShutdown(boolean logShutdown) {
      this.logShutdown = logShutdown;
    }
  }
}

