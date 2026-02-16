/*
 * Â© Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
package com.isstrack.issue_tracker.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateProjectRequest(
    @NotBlank @Size(max = 255) String name,
    @NotBlank @Size(min = 2, max = 10) @jakarta.validation.constraints.Pattern(regexp = "^[A-Z][A-Z0-9]*$", message = "Prefix must be uppercase letters and numbers, starting with a letter") String prefix
) {}

