/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.config;

import jakarta.annotation.PostConstruct;
import java.util.Arrays;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.info.BuildProperties;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class StartupReport {
  private static final Logger log = LoggerFactory.getLogger(StartupReport.class);

  private final Environment environment;
  private final BuildProperties buildProperties;
  private final AppConfigLoader.ConfigFile configFile;
  private final String serverPort;
  private final String datasourceUrl;
  private final String datasourceUser;
  private final String openInView;
  private final String jwtIssuer;
  private final String jwtExpiration;
  private final String websocketAllowedOrigins;
  private final String websocketAllowQueryToken;

  public StartupReport(
      Environment environment,
      @org.springframework.beans.factory.annotation.Autowired(required = false)
          BuildProperties buildProperties,
      @Value("${service.name:Issue Tracker API}") String serviceName,
      @Value("${service.environment:default}") String serviceEnvironment,
      @Value("${service.external-url:}") String serviceExternalUrl,
      @Value("${server.port:8080}") String serverPort,
      @Value("${spring.datasource.url:}") String datasourceUrl,
      @Value("${spring.datasource.username:}") String datasourceUser,
      @Value("${spring.jpa.open-in-view:true}") String openInView,
      @Value("${app.jwt.issuer:}") String jwtIssuer,
      @Value("${app.jwt.expirationMinutes:}") String jwtExpiration,
      @Value("${websocket.allowed-origins:}") String websocketAllowedOrigins,
      @Value("${websocket.auth.allow-query-token:false}") String websocketAllowQueryToken) {
    this.environment = environment;
    this.buildProperties = buildProperties;
    this.configFile = AppConfigHolder.getConfigFile();
    this.serverPort = serverPort;
    this.datasourceUrl = datasourceUrl;
    this.datasourceUser = datasourceUser;
    this.openInView = openInView;
    this.jwtIssuer = jwtIssuer;
    this.jwtExpiration = jwtExpiration;
    this.websocketAllowedOrigins = websocketAllowedOrigins;
    this.websocketAllowQueryToken = websocketAllowQueryToken;

    AppConfigLoader.ConfigFile localConfig = this.configFile;
    if (localConfig != null && localConfig.service != null) {
      if (localConfig.service.name == null) {
        localConfig.service.name = serviceName;
      }
      if (localConfig.service.environment == null) {
        localConfig.service.environment = serviceEnvironment;
      }
      if (localConfig.service.externalUrl == null) {
        localConfig.service.externalUrl = serviceExternalUrl;
      }
    }
  }

  @PostConstruct
  public void logReport() {
    log.info("\n{}", buildReport());
    LifecycleLogger.startup(log, "Startup report generated, JVM heap max={}MB, processors={}", Runtime.getRuntime().maxMemory() / (1024 * 1024), Runtime.getRuntime().availableProcessors());
    LifecycleLogger.startup(log, "Datasource configured: url={}, user={}", datasourceUrl, datasourceUser);
  }

  private String buildReport() {
    StringBuilder builder = new StringBuilder();
    builder.append("\n");
    appendSection(builder, "Service", new String[][] {
        {"Name", valueOrDefault(configValue(() -> configFile.service.name), "Issue Tracker API")},
        {"Environment", valueOrDefault(configValue(() -> configFile.service.environment), "default")},
        {"External URL", valueOrDefault(configValue(() -> configFile.service.externalUrl), "-")},
        {"Port", serverPort},
        {"Open-In-View", openInView}
    });

    appendSection(builder, "Build", new String[][] {
        {"Version", buildProperties == null ? "unknown" : buildProperties.getVersion()},
        {"Time", buildProperties == null ? "unknown" : buildProperties.getTime().toString()}
    });

    appendSection(builder, "Database", new String[][] {
        {"URL", datasourceUrl},
        {"User", datasourceUser},
        {"Host", configValue(() -> configFile.database.host)},
        {"Port", configValue(() -> Integer.toString(configFile.database.port))},
        {"Database", configValue(() -> configFile.database.database)}
    });

    appendSection(builder, "Security", new String[][] {
        {"JWT Issuer", jwtIssuer},
        {"JWT Expiration (min)", jwtExpiration}
    });

    appendSection(builder, "Websocket", new String[][] {
        {"Allowed Origins", websocketAllowedOrigins},
        {"Allow Query Token", websocketAllowQueryToken}
    });

    appendSection(builder, "Runtime", new String[][] {
        {"Active Profiles", String.join(", ", environment.getActiveProfiles())},
        {"Java", System.getProperty("java.version")},
        {"PID", Management.pid()}
    });

    if (configFile != null && configFile.diagnostics != null) {
      appendSection(builder, "Diagnostics", new String[][] {
          {"Memory Log Enabled", Boolean.toString(configFile.diagnostics.enableMemoryLogging)},
          {"Memory Log Interval (s)", Integer.toString(configFile.diagnostics.memoryLogIntervalSeconds)},
          {"GC Stats Enabled", Boolean.toString(configFile.diagnostics.enableGcStats)},
          {"Memory Cleanup Enabled", Boolean.toString(configFile.diagnostics.enableMemoryCleanup)},
          {"Cleanup Interval (s)", Integer.toString(configFile.diagnostics.memoryCleanupIntervalSeconds)},
          {"Cleanup Threshold (MB)", Integer.toString(configFile.diagnostics.memoryCleanupThresholdMb)}
      });
    }

    if (configFile != null && configFile.memoryBudget != null) {
      appendSection(builder, "Memory Budget", new String[][] {
          {"Enabled", Boolean.toString(configFile.memoryBudget.enabled)},
          {"Target Working Set (MB)", Integer.toString(configFile.memoryBudget.targetWorkingSetMb)},
          {"GC Heap Hard Limit (MB)", Integer.toString(configFile.memoryBudget.gcHeapHardLimitMb)},
          {"Memory Cache Limit (MB)", Integer.toString(configFile.memoryBudget.memoryCacheSizeLimitMb)},
          {"Prompt Cache Limit (MB)", Integer.toString(configFile.memoryBudget.promptCacheLimitMb)},
          {"Prompt ML Cache Limit (MB)", Integer.toString(configFile.memoryBudget.promptMlCacheLimitMb)},
          {"Max Logged Payload Bytes", Integer.toString(configFile.memoryBudget.maxLoggedPayloadBytesPerOperation)}
      });
    }

    if (configFile != null && configFile.lifecycleLogging != null) {
      appendSection(builder, "Lifecycle Logging", new String[][] {
          {"Enabled", Boolean.toString(configFile.lifecycleLogging.enabled)},
          {"Startup Phases", Boolean.toString(configFile.lifecycleLogging.logStartupPhases)},
          {"Requests", Boolean.toString(configFile.lifecycleLogging.logRequests)},
          {"Security", Boolean.toString(configFile.lifecycleLogging.logSecurity)},
          {"WebSocket", Boolean.toString(configFile.lifecycleLogging.logWebSocket)},
          {"Database", Boolean.toString(configFile.lifecycleLogging.logDatabase)},
          {"Scheduled Tasks", Boolean.toString(configFile.lifecycleLogging.logScheduledTasks)},
          {"Shutdown", Boolean.toString(configFile.lifecycleLogging.logShutdown)}
      });
    }

    return builder.toString();
  }

  private void appendSection(StringBuilder builder, String title, String[][] rows) {
    int width = Arrays.stream(rows)
        .mapToInt(row -> row[0].length())
        .max()
        .orElse(0);
    builder.append(title).append("\n");
    builder.append("-").append("-".repeat(Math.max(title.length() - 1, 1))).append("\n");
    for (String[] row : rows) {
      String label = row[0];
      String value = valueOrDefault(row[1], "-");
      builder.append(String.format("%-" + width + "s : %s%n", label, value));
    }
    builder.append("\n");
  }

  private String configValue(ValueSupplier supplier) {
    try {
      return supplier.get();
    } catch (Exception ex) {
      return "-";
    }
  }

  private String valueOrDefault(String value, String fallback) {
    if (value == null || value.isBlank()) {
      return fallback;
    }
    return value;
  }

  private interface ValueSupplier {
    String get();
  }

  private static final class Management {
    private static String pid() {
      return java.lang.management.ManagementFactory.getRuntimeMXBean().getName().split("@")[0];
    }
  }
}

