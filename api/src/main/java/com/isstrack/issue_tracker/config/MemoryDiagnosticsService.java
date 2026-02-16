/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.config;

import jakarta.annotation.PreDestroy;
import java.lang.management.GarbageCollectorMXBean;
import java.lang.management.ManagementFactory;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class MemoryDiagnosticsService {
  private static final Logger log = LoggerFactory.getLogger(MemoryDiagnosticsService.class);
  private static final long BYTES_PER_MB = 1024 * 1024;

  private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
  private final AppConfigLoader.ConfigFile configFile;
  private final List<GarbageCollectorMXBean> garbageCollectors;
  private long lastGcCount;
  private long lastGcTimeMs;
  private boolean started;

  public MemoryDiagnosticsService() {
    this.configFile = AppConfigHolder.getConfigFile();
    this.garbageCollectors = ManagementFactory.getGarbageCollectorMXBeans();
    LifecycleLogger.startup(log, "MemoryDiagnosticsService constructed, configFile={}, garbageCollectors={}", configFile != null, garbageCollectors.size());
  }

  @EventListener(ApplicationReadyEvent.class)
  public void startAfterStartup() {
    LifecycleLogger.startup(log, "MemoryDiagnosticsService.startAfterStartup() invoked, already started={}", started);
    if (started) {
      return;
    }
    started = true;
    if (configFile == null || configFile.diagnostics == null) {
      return;
    }

    AppConfigLoader.DiagnosticsConfig diagnostics = configFile.diagnostics;
    if (diagnostics.enableMemoryCleanup) {
      runCleanupIfNeeded(true);
      LifecycleLogger.scheduled(log, "Scheduling memory cleanup every {}s, threshold={}MB", Math.max(10, diagnostics.memoryCleanupIntervalSeconds), diagnostics.memoryCleanupThresholdMb);
      scheduleCleanup(diagnostics);
    }

    if (diagnostics.enableMemoryLogging) {
      LifecycleLogger.scheduled(log, "Scheduling memory logging every {}s", Math.max(5, diagnostics.memoryLogIntervalSeconds));
      scheduleMemoryLogging(diagnostics);
    }
  }

  @PreDestroy
  public void stop() {
    LifecycleLogger.shutdown(log, "MemoryDiagnosticsService shutting down scheduler");
    scheduler.shutdownNow();
  }

  private void scheduleMemoryLogging(AppConfigLoader.DiagnosticsConfig diagnostics) {
    long interval = Math.max(5, diagnostics.memoryLogIntervalSeconds);
    scheduler.scheduleAtFixedRate(this::logMemoryUsage, interval, interval, TimeUnit.SECONDS);
  }

  private void scheduleCleanup(AppConfigLoader.DiagnosticsConfig diagnostics) {
    long interval = Math.max(10, diagnostics.memoryCleanupIntervalSeconds);
    scheduler.scheduleAtFixedRate(() -> runCleanupIfNeeded(false), interval, interval, TimeUnit.SECONDS);
  }

  private void runCleanupIfNeeded(boolean startup) {
    AppConfigLoader.DiagnosticsConfig diagnostics = configFile.diagnostics;
    if (diagnostics == null || !diagnostics.enableMemoryCleanup) {
      return;
    }

    long usedMb = getUsedMemoryMb();
    if (startup || usedMb >= diagnostics.memoryCleanupThresholdMb) {
      long before = getUsedMemoryMb();
      long gcBefore = totalGcCount();
      long gcTimeBefore = totalGcTime();
      System.gc();
      long after = getUsedMemoryMb();
      long gcAfter = totalGcCount();
      long gcTimeAfter = totalGcTime();
      log.info(
          "[Diagnostics] Memory cleanup {}. Used {} MB -> {} MB. GC count delta {} time delta {} ms",
          startup ? "at startup" : "triggered",
          before,
          after,
          gcAfter - gcBefore,
          gcTimeAfter - gcTimeBefore);
      LifecycleLogger.scheduled(log, "Heap detail: total={}MB, free={}MB, max={}MB, processors={}", Runtime.getRuntime().totalMemory() / BYTES_PER_MB, Runtime.getRuntime().freeMemory() / BYTES_PER_MB, Runtime.getRuntime().maxMemory() / BYTES_PER_MB, Runtime.getRuntime().availableProcessors());
    }
  }

  private void logMemoryUsage() {
    long usedMb = getUsedMemoryMb();
    long committedMb = getCommittedMemoryMb();
    long maxMb = getMaxMemoryMb();

    String gcStats = "";
    if (configFile != null && configFile.diagnostics != null && configFile.diagnostics.enableGcStats) {
      long currentGcCount = totalGcCount();
      long currentGcTime = totalGcTime();
      long gcCountDelta = currentGcCount - lastGcCount;
      long gcTimeDelta = currentGcTime - lastGcTimeMs;
      lastGcCount = currentGcCount;
      lastGcTimeMs = currentGcTime;
      gcStats = String.format(
          " GC(count+%d, time+%dms)",
          gcCountDelta,
          gcTimeDelta);
    }

    log.info(
        "[Diagnostics] Memory {} | used {} MB | committed {} MB | max {} MB{}",
        Instant.now(),
        usedMb,
        committedMb,
        maxMb,
        gcStats);
  }

  private long getUsedMemoryMb() {
    Runtime runtime = Runtime.getRuntime();
    return (runtime.totalMemory() - runtime.freeMemory()) / BYTES_PER_MB;
  }

  private long getCommittedMemoryMb() {
    return Runtime.getRuntime().totalMemory() / BYTES_PER_MB;
  }

  private long getMaxMemoryMb() {
    return Runtime.getRuntime().maxMemory() / BYTES_PER_MB;
  }

  private long totalGcCount() {
    return garbageCollectors.stream()
        .mapToLong(gc -> Math.max(gc.getCollectionCount(), 0))
        .sum();
  }

  private long totalGcTime() {
    return garbageCollectors.stream()
        .mapToLong(gc -> Math.max(gc.getCollectionTime(), 0))
        .sum();
  }
}

