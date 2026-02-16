/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.config;

public final class AppConfigHolder {
  private static volatile AppConfigLoader.ConfigFile configFile;

  private AppConfigHolder() {}

  public static void setConfigFile(AppConfigLoader.ConfigFile configFile) {
    AppConfigHolder.configFile = configFile;
  }

  public static AppConfigLoader.ConfigFile getConfigFile() {
    return configFile;
  }
}

