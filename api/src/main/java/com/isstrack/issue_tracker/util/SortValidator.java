package com.isstrack.issue_tracker.util;

import java.util.Set;
import org.springframework.data.domain.Sort;

public final class SortValidator {
  private SortValidator() {
  }

  public static Sort validateOrDefault(String sort, Set<String> allowedFields, Sort fallback) {
    if (sort == null || sort.isBlank()) {
      return fallback;
    }
    String[] parts = sort.split(",");
    if (parts.length == 0) {
      return fallback;
    }
    String field = parts[0].trim();
    if (!allowedFields.contains(field)) {
      return fallback;
    }
    Sort.Direction direction = Sort.Direction.DESC;
    if (parts.length > 1 && "asc".equalsIgnoreCase(parts[1])) {
      direction = Sort.Direction.ASC;
    }
    return Sort.by(direction, field);
  }
}
