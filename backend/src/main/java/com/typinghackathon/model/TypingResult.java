package com.typinghackathon.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class TypingResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int wpm;
    private double accuracy;
    private long durationMs;

    public TypingResult() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getWpm() { return wpm; }
    public void setWpm(int wpm) { this.wpm = wpm; }

    public double getAccuracy() { return accuracy; }
    public void setAccuracy(double accuracy) { this.accuracy = accuracy; }

    public long getDurationMs() { return durationMs; }
    public void setDurationMs(long durationMs) { this.durationMs = durationMs; }
}
