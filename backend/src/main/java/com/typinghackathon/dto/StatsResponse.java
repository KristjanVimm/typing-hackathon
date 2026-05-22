package com.typinghackathon.dto;

public record StatsResponse(
        long totalSessions,
        double averageWpm,
        double bestWpm,
        double averageAccuracy,
        long totalDurationMs,
        long totalCharacters,
        long totalCorrectCharacters,
        long totalIncorrectCharacters
) {
    public static StatsResponse empty() {
        return new StatsResponse(0, 0, 0, 0, 0, 0, 0, 0);
    }
}
