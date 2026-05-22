package com.typinghackathon.repository;

import com.typinghackathon.model.TypingResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TypingResultRepository extends JpaRepository<TypingResult, Long> {
}
