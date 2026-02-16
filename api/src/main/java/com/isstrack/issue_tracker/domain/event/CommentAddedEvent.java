/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.domain.event;

import com.isstrack.issue_tracker.api.dto.CommentDto;
import java.time.Instant;

public record CommentAddedEvent(Long issueId, CommentDto payload, Instant occurredAt) implements DomainEvent {
}

