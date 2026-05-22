package com.typinghackathon.service;

import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
public class WordService {

    public static final int MIN_COUNT = 1;
    public static final int MAX_COUNT = 100;

    private static final String WORDS_RESOURCE = "words.txt";

    private List<String> words;

    @PostConstruct
    void loadWords() throws IOException {
        ClassPathResource resource = new ClassPathResource(WORDS_RESOURCE);
        if (!resource.exists()) {
            throw new IllegalStateException("Required resource not found on classpath: " + WORDS_RESOURCE);
        }
        try (InputStream in = resource.getInputStream();
             BufferedReader reader = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8))) {
            words = reader.lines()
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toUnmodifiableList());
        }
        if (words.isEmpty()) {
            throw new IllegalStateException("Word bank is empty: " + WORDS_RESOURCE);
        }
    }

    public String randomWords(int count) {
        return randomWords(count, null, null);
    }

    public String randomWords(int count, Integer minLength, Integer maxLength) {
        if (count < MIN_COUNT || count > MAX_COUNT) {
            throw new IllegalArgumentException(
                    "count must be between " + MIN_COUNT + " and " + MAX_COUNT + " (got " + count + ")");
        }
        if (minLength != null && maxLength != null && minLength > maxLength) {
            throw new IllegalArgumentException(
                    "minLength (" + minLength + ") must not exceed maxLength (" + maxLength + ")");
        }
        List<String> pool = filterByLength(minLength, maxLength);
        if (pool.isEmpty()) {
            throw new IllegalArgumentException(
                    "no words match length range [" + minLength + ".." + maxLength + "]");
        }
        ThreadLocalRandom rnd = ThreadLocalRandom.current();
        StringBuilder sb = new StringBuilder(count * 8);
        int size = pool.size();
        for (int i = 0; i < count; i++) {
            if (i > 0) sb.append(' ');
            sb.append(pool.get(rnd.nextInt(size)));
        }
        return sb.toString();
    }

    private List<String> filterByLength(Integer minLength, Integer maxLength) {
        if (minLength == null && maxLength == null) return words;
        int lo = minLength == null ? 0 : minLength;
        int hi = maxLength == null ? Integer.MAX_VALUE : maxLength;
        return words.stream()
                .filter(w -> w.length() >= lo && w.length() <= hi)
                .collect(Collectors.toUnmodifiableList());
    }
}
