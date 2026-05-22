package com.typinghackathon.service;

import com.typinghackathon.dto.KeyErrorDto;
import com.typinghackathon.dto.StatsResponse;
import com.typinghackathon.dto.TypingResultRequest;
import com.typinghackathon.dto.WordAttemptDto;
import com.typinghackathon.model.KeyError;
import com.typinghackathon.model.TypingResult;
import com.typinghackathon.model.WordAttempt;
import com.typinghackathon.repository.TypingResultRepository;
import com.typinghackathon.repository.TypingResultRepository.StatsProjection;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class TypingService {

    private final TypingResultRepository repository;

    public TypingService(TypingResultRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public TypingResult save(TypingResultRequest request) {
        TypingResult entity = new TypingResult();
        entity.setSessionId(request.sessionId());
        entity.setUserId(request.userId());
        entity.setWpm(request.wpm());
        entity.setRawWpm(request.rawWpm());
        entity.setAccuracy(request.accuracy());
        entity.setDurationMs(request.durationMs());
        entity.setTotalCharacters(request.totalCharacters());
        entity.setCorrectCharacters(request.correctCharacters());
        entity.setIncorrectCharacters(request.incorrectCharacters());
        entity.setTotalWords(request.totalWords());
        entity.setCorrectWords(request.correctWords());
        entity.setIncorrectWords(request.incorrectWords());
        entity.setCreatedAt(Instant.now());

        List<WordAttemptDto> attempts = request.wordAttempts();
        if (attempts != null) {
            for (WordAttemptDto dto : attempts) {
                WordAttempt wa = new WordAttempt();
                wa.setPosition(dto.position());
                wa.setExpectedWord(dto.expectedWord());
                wa.setTypedWord(dto.typedWord());
                wa.setCorrect(dto.correct());
                wa.setTimeMs(dto.timeMs());
                wa.setMistakes(dto.mistakes());
                entity.addWordAttempt(wa);
            }
        }

        List<KeyErrorDto> keyErrors = request.keyErrors();
        if (keyErrors != null) {
            for (KeyErrorDto dto : keyErrors) {
                KeyError ke = new KeyError();
                ke.setExpectedChar(dto.expectedChar());
                ke.setTypedChar(dto.typedChar());
                ke.setCount(dto.count());
                entity.addKeyError(ke);
            }
        }

        return repository.save(entity);
    }

    @Transactional(readOnly = true)
    public StatsResponse stats(String userId) {
        StatsProjection p = (userId == null || userId.isBlank())
                ? repository.aggregateStatsAll()
                : repository.aggregateStats(userId);
        if (p == null || p.getTotalSessions() == 0) {
            return StatsResponse.empty();
        }
        return new StatsResponse(
                p.getTotalSessions(),
                nz(p.getAverageWpm()),
                nz(p.getBestWpm()),
                nz(p.getAverageAccuracy()),
                nzL(p.getTotalDurationMs()),
                nzL(p.getTotalCharacters()),
                nzL(p.getTotalCorrectCharacters()),
                nzL(p.getTotalIncorrectCharacters())
        );
    }

    private static double nz(Double v) { return v == null ? 0d : v; }
    private static long nzL(Long v) { return v == null ? 0L : v; }
}
