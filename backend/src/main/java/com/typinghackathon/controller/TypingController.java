package com.typinghackathon.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/typing")
public class TypingController {

    @GetMapping("/text")
    public String getPracticeText() {
        return "the quick brown fox jumps over the lazy dog";
    }
}
