package com.isstrack.issue_tracker.domain.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public final class PaginationHelper {
  private PaginationHelper() {
  }

  public static Pageable page(int page, int size, Sort sort) {
    int normalizedSize = Math.min(size, 100);
    return PageRequest.of(page, normalizedSize, sort);
  }

  public static Pageable page(int page, int size) {
    int normalizedSize = Math.min(size, 100);
    return PageRequest.of(page, normalizedSize);
  }
}
