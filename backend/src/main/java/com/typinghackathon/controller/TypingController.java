package com.typinghackathon.controller;

import com.typinghackathon.dto.StatsResponse;
import com.typinghackathon.dto.TypingResultRequest;
import com.typinghackathon.dto.TypingResultResponse;
import com.typinghackathon.model.TypingResult;
import com.typinghackathon.service.TypingService;
import com.typinghackathon.service.WordService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/typing")
public class TypingController {

    private final WordService wordService;
    private final TypingService typingService;

    public TypingController(WordService wordService, TypingService typingService) {
        this.wordService = wordService;
        this.typingService = typingService;
    }

    @GetMapping("/text")
    public String getPracticeText() {
        return "the quick brown fox jumps over the lazy dog";
    }

    @GetMapping(value = "/words", produces = MediaType.TEXT_PLAIN_VALUE)
    public String getRandomWords(
            @RequestParam(defaultValue = "25") int count,
            @RequestParam(required = false) Integer minLength,
            @RequestParam(required = false) Integer maxLength) {
        try {
            return wordService.randomWords(count, minLength, maxLength);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/results")
    public ResponseEntity<TypingResultResponse> submitResult(@Valid @RequestBody TypingResultRequest request) {
        TypingResult saved = typingService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(TypingResultResponse.from(saved));
    }

    @GetMapping("/stats")
    public StatsResponse getStats(@RequestParam(required = false) String userId) {
        return typingService.stats(userId);
    }
}
