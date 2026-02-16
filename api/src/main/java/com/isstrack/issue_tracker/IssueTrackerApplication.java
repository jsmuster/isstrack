/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker;

import com.isstrack.issue_tracker.config.AppConfigHolder;
import com.isstrack.issue_tracker.config.AppConfigLoader;
import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class IssueTrackerApplication {
  public static void main(String[] args) {
    System.out.println("[Lifecycle:Startup] Application main() entered");
    SpringApplication app = new SpringApplication(IssueTrackerApplication.class);
    AppConfigLoader.LoadedConfig loadedConfig = AppConfigLoader.load();
    System.out.println("[Lifecycle:Startup] Config loaded from " + System.getenv().getOrDefault("APP_CONFIG_PATH", "/app/config.json"));
    Map<String, Object> defaults = loadedConfig.getProperties();
    if (!defaults.isEmpty()) {
      applyConfigDefaults(defaults);
    }
    System.out.println("[Lifecycle:Startup] Config defaults applied, properties count: " + defaults.size());
    AppConfigHolder.setConfigFile(loadedConfig.getConfigFile());
    System.out.println("[Lifecycle:Startup] ConfigFile set in holder");
    applyConfigOverrides(loadedConfig.getConfigFile());
    System.out.println("[Lifecycle:Startup] Config overrides applied");
    Runtime rt = Runtime.getRuntime();
    System.out.println("[Lifecycle:Startup] JVM heap: max=" + (rt.maxMemory() / 1024 / 1024) + "MB, total=" + (rt.totalMemory() / 1024 / 1024) + "MB, free=" + (rt.freeMemory() / 1024 / 1024) + "MB");
    System.out.println("[Lifecycle:Startup] Available processors: " + rt.availableProcessors());
    rt.addShutdownHook(new Thread(() -> {
      Runtime r = Runtime.getRuntime();
      System.out.println("[Lifecycle:Shutdown] JVM shutdown hook triggered");
      System.out.println("[Lifecycle:Shutdown] Heap: used=" + ((r.totalMemory() - r.freeMemory()) / 1024 / 1024) + "MB, total=" + (r.totalMemory() / 1024 / 1024) + "MB, max=" + (r.maxMemory() / 1024 / 1024) + "MB");
      System.out.println("[Lifecycle:Shutdown] Thread count: " + Thread.activeCount());
    }, "lifecycle-shutdown-hook"));
    System.out.println("[Lifecycle:Startup] Calling SpringApplication.run()...");
    app.run(args);
    System.out.println("[Lifecycle:Startup] SpringApplication.run() completed");
  }

  private static void applyConfigDefaults(Map<String, Object> defaults) {
    Map<String, String> env = System.getenv();
    for (Map.Entry<String, Object> entry : defaults.entrySet()) {
      String key = entry.getKey();
      if (System.getProperty(key) != null) {
        continue;
      }

      String envKey = key.toUpperCase().replace('.', '_');
      if (env.containsKey(envKey)) {
        continue;
      }

      System.setProperty(key, String.valueOf(entry.getValue()));
    }
  }

  private static void applyConfigOverrides(AppConfigLoader.ConfigFile configFile) {
    if (configFile == null) {
      return;
    }

    if (configFile.service != null) {
      System.setProperty("service.name", defaultString(configFile.service.name));
      System.setProperty("service.environment", defaultString(configFile.service.environment));
      System.setProperty("service.external-url", defaultString(configFile.service.externalUrl));
      System.setProperty(
          "spring.jpa.open-in-view",
          Boolean.toString(configFile.service.enableOpenInView));
    }

    if (configFile.logging != null && configFile.logging.level != null) {
      System.setProperty("logging.level.root", configFile.logging.level);
    }

    if (configFile.security != null) {
      if (configFile.security.jwtIssuer != null) {
        System.setProperty("app.jwt.issuer", configFile.security.jwtIssuer);
      }
      if (configFile.security.jwtExpirationMinutes > 0) {
        System.setProperty(
            "app.jwt.expirationMinutes",
            Integer.toString(configFile.security.jwtExpirationMinutes));
      }
    }

    if (configFile.websocket != null) {
      if (configFile.websocket.allowedOrigins != null
          && configFile.websocket.allowedOrigins.length > 0) {
        System.setProperty(
            "websocket.allowed-origins",
            String.join(",", configFile.websocket.allowedOrigins));
      }
      System.setProperty(
          "websocket.auth.allow-query-token",
          Boolean.toString(configFile.websocket.allowQueryToken));
    }
  }

  private static String defaultString(String value) {
    return value == null ? "" : value;
  }
}
