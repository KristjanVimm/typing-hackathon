package com.typinghackathon.dto;

import com.typinghackathon.model.TypingResult;

import java.time.Instant;

public record TypingResultResponse(
        Long id,
        String sessionId,
        String userId,
        double wpm,
        double rawWpm,
        double accuracy,
        long durationMs,
        int totalCharacters,
        int correctCharacters,
        int incorrectCharacters,
        int totalWords,
        int correctWords,
        int incorrectWords,
        Instant createdAt
) {
    public static TypingResultResponse from(TypingResult r) {
        return new TypingResultResponse(
                r.getId(),
                r.getSessionId(),
                r.getUserId(),
                r.getWpm(),
                r.getRawWpm(),
                r.getAccuracy(),
                r.getDurationMs(),
                r.getTotalCharacters(),
                r.getCorrectCharacters(),
                r.getIncorrectCharacters(),
                r.getTotalWords(),
                r.getCorrectWords(),
                r.getIncorrectWords(),
                r.getCreatedAt()
        );
    }
}
