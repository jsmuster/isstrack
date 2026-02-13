package com.isstrack.issue_tracker.domain.service;

import com.isstrack.issue_tracker.api.error.BadRequestException;
import com.isstrack.issue_tracker.persistence.entity.TagEntity;
import com.isstrack.issue_tracker.persistence.repo.TagRepository;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TagService {
  private final TagRepository tagRepository;

  public TagService(TagRepository tagRepository) {
    this.tagRepository = tagRepository;
  }

  @Transactional
  public List<TagEntity> normalizeAndSave(List<String> tags) {
    if (tags == null || tags.isEmpty()) {
      return List.of();
    }
    Set<String> normalized = new HashSet<>();
    for (String raw : tags) {
      if (raw == null) {
        continue;
      }
      var value = raw.trim().toLowerCase(Locale.ROOT).replaceAll("\\s+", " ");
      if (value.isBlank()) {
        throw new BadRequestException("Tag name cannot be blank");
      }
      normalized.add(value);
    }
    List<TagEntity> results = new ArrayList<>();
    for (String name : normalized) {
      var tag = tagRepository.findByNameIgnoreCase(name).orElseGet(() -> {
        var newTag = new TagEntity();
        newTag.setName(name);
        return tagRepository.save(newTag);
      });
      results.add(tag);
    }
    return results;
  }
}
