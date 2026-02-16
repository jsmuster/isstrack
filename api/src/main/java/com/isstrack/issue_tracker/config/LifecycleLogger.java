/*
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.config;

import org.slf4j.Logger;

public final class LifecycleLogger {
  private LifecycleLogger() {}

  private static AppConfigLoader.LifecycleLoggingConfig config() {
    AppConfigLoader.ConfigFile cf = AppConfigHolder.getConfigFile();
    return cf == null ? null : cf.lifecycleLogging;
  }

  public static void startup(Logger log, String message, Object... args) {
    AppConfigLoader.LifecycleLoggingConfig c = config();
    if (c != null && c.enabled && c.logStartupPhases) {
      log.info("[Lifecycle:Startup] " + message, args);
    }
  }

  public static void request(Logger log, String message, Object... args) {
    AppConfigLoader.LifecycleLoggingConfig c = config();
    if (c != null && c.enabled && c.logRequests) {
      log.info("[Lifecycle:Request] " + message, args);
    }
  }

  public static void security(Logger log, String message, Object... args) {
    AppConfigLoader.LifecycleLoggingConfig c = config();
    if (c != null && c.enabled && c.logSecurity) {
      log.info("[Lifecycle:Security] " + message, args);
    }
  }

  public static void websocket(Logger log, String message, Object... args) {
    AppConfigLoader.LifecycleLoggingConfig c = config();
    if (c != null && c.enabled && c.logWebSocket) {
      log.info("[Lifecycle:WebSocket] " + message, args);
    }
  }

  public static void database(Logger log, String message, Object... args) {
    AppConfigLoader.LifecycleLoggingConfig c = config();
    if (c != null && c.enabled && c.logDatabase) {
      log.info("[Lifecycle:Database] " + message, args);
    }
  }

  public static void scheduled(Logger log, String message, Object... args) {
    AppConfigLoader.LifecycleLoggingConfig c = config();
    if (c != null && c.enabled && c.logScheduledTasks) {
      log.info("[Lifecycle:Scheduled] " + message, args);
    }
  }

  public static void shutdown(Logger log, String message, Object... args) {
    AppConfigLoader.LifecycleLoggingConfig c = config();
    if (c != null && c.enabled && c.logShutdown) {
      log.info("[Lifecycle:Shutdown] " + message, args);
    }
  }
}
