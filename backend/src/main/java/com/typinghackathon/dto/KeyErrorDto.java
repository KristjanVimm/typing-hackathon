package com.typinghackathon.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record KeyErrorDto(
        @NotBlank @Size(max = 8) String expectedChar,
        @Size(max = 8) String typedChar,
        @PositiveOrZero int count
) {
}
