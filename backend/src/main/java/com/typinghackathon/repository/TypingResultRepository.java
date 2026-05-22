package com.typinghackathon.repository;

import com.typinghackathon.model.TypingResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TypingResultRepository extends JpaRepository<TypingResult, Long> {

    @Query("""
            select
              count(r) as totalSessions,
              coalesce(avg(r.wpm), 0) as averageWpm,
              coalesce(max(r.wpm), 0) as bestWpm,
              coalesce(avg(r.accuracy), 0) as averageAccuracy,
              coalesce(sum(r.durationMs), 0) as totalDurationMs,
              coalesce(sum(r.totalCharacters), 0) as totalCharacters,
              coalesce(sum(r.correctCharacters), 0) as totalCorrectCharacters,
              coalesce(sum(r.incorrectCharacters), 0) as totalIncorrectCharacters
            from TypingResult r
            where (:userId is null and r.userId is null) or r.userId = :userId
            """)
    StatsProjection aggregateStats(@Param("userId") String userId);

    @Query("""
            select
              count(r) as totalSessions,
              coalesce(avg(r.wpm), 0) as averageWpm,
              coalesce(max(r.wpm), 0) as bestWpm,
              coalesce(avg(r.accuracy), 0) as averageAccuracy,
              coalesce(sum(r.durationMs), 0) as totalDurationMs,
              coalesce(sum(r.totalCharacters), 0) as totalCharacters,
              coalesce(sum(r.correctCharacters), 0) as totalCorrectCharacters,
              coalesce(sum(r.incorrectCharacters), 0) as totalIncorrectCharacters
            from TypingResult r
            """)
    StatsProjection aggregateStatsAll();

    interface StatsProjection {
        long getTotalSessions();
        Double getAverageWpm();
        Double getBestWpm();
        Double getAverageAccuracy();
        Long getTotalDurationMs();
        Long getTotalCharacters();
        Long getTotalCorrectCharacters();
        Long getTotalIncorrectCharacters();
    }
}
