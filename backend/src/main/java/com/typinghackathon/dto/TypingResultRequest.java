package com.typinghackathon.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.util.List;

public record TypingResultRequest(
        @Size(max = 64) String sessionId,
        @Size(max = 64) String userId,

        @DecimalMin("0.0") @DecimalMax("1000.0") double wpm,
        @DecimalMin("0.0") @DecimalMax("1000.0") double rawWpm,
        @DecimalMin("0.0") @DecimalMax("100.0") double accuracy,
        @Min(0) long durationMs,

        @PositiveOrZero int totalCharacters,
        @PositiveOrZero int correctCharacters,
        @PositiveOrZero int incorrectCharacters,

        @PositiveOrZero int totalWords,
        @PositiveOrZero int correctWords,
        @PositiveOrZero int incorrectWords,

        @Valid List<WordAttemptDto> wordAttempts,
        @Valid List<KeyErrorDto> keyErrors
) {
}
