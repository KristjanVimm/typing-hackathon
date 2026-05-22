package com.typinghackathon.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record WordAttemptDto(
        @PositiveOrZero int position,
        @NotBlank @Size(max = 128) String expectedWord,
        @Size(max = 128) String typedWord,
        boolean correct,
        @Min(0) long timeMs,
        @PositiveOrZero int mistakes
) {
}
