#!/bin/sh
set -e

CONFIG_PATH="${APP_CONFIG_PATH:-/app/config.json}"

heap_limit_mb=""
if [ -f "$CONFIG_PATH" ]; then
  heap_limit_mb=$(awk -F'[: ,]+' '/"gcHeapHardLimitMb"/ {print $3; exit}' "$CONFIG_PATH")
fi

if [ -n "$heap_limit_mb" ]; then
  export JAVA_TOOL_OPTIONS="-Xmx${heap_limit_mb}m $JAVA_TOOL_OPTIONS"
  echo "[Startup] JAVA_TOOL_OPTIONS=$JAVA_TOOL_OPTIONS"
fi

jar_path="/app/app.jar"
if [ ! -f "$jar_path" ]; then
  for candidate in /app/*.jar; do
    if [ -f "$candidate" ]; then
      jar_path="$candidate"
      break
    fi
  done
fi

if [ ! -f "$jar_path" ]; then
  echo "[Startup] ERROR: No jar found in /app"
  exit 1
fi

exec java $JAVA_TOOL_OPTIONS -jar "$jar_path"
