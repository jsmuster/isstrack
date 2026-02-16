/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.api.controller;

import com.isstrack.issue_tracker.api.dto.AddCommentRequest;
import com.isstrack.issue_tracker.api.dto.CommentDto;
import com.isstrack.issue_tracker.api.dto.PageResponse;
import com.isstrack.issue_tracker.api.dto.UpdateCommentRequest;
import com.isstrack.issue_tracker.domain.security.CurrentUser;
import com.isstrack.issue_tracker.domain.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/issues/{issueId}/comments")
public class CommentController {
  private final CommentService commentService;

  public CommentController(CommentService commentService) {
    this.commentService = commentService;
  }

  @PostMapping
  public CommentDto addComment(@PathVariable long issueId, @Valid @RequestBody AddCommentRequest request) {
    long userId = CurrentUser.requireUserId();
    return commentService.addComment(userId, issueId, request.body());
  }

  @GetMapping
  public PageResponse<CommentDto> listComments(
      @PathVariable long issueId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size
  ) {
    long userId = CurrentUser.requireUserId();
    Pageable pageable = com.isstrack.issue_tracker.domain.service.PaginationHelper.page(page, size);
    return commentService.listComments(userId, issueId, pageable);
  }

  @PutMapping("/{commentId}")
  public CommentDto updateComment(
      @PathVariable long issueId,
      @PathVariable long commentId,
      @Valid @RequestBody UpdateCommentRequest request
  ) {
    long userId = CurrentUser.requireUserId();
    return commentService.updateComment(userId, issueId, commentId, request.body());
  }

  @DeleteMapping("/{commentId}")
  public void deleteComment(@PathVariable long issueId, @PathVariable long commentId) {
    long userId = CurrentUser.requireUserId();
    commentService.deleteComment(userId, issueId, commentId);
  }
}

