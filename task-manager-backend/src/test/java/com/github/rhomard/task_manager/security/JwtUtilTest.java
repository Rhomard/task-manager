package com.github.rhomard.task_manager.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        // On injecte manuellement le secret, puisqu'il n'y a pas de contexte Spring ici
        ReflectionTestUtils.setField(jwtUtil, "secret", "CeciEstUneCleSecretePourJWTQuiDoitFaireAuMoins32Caracteres");
    }

    @Test
    void generateToken_thenExtractEmail_shouldReturnSameEmail() {
        String email = "test@example.com";

        String token = jwtUtil.generateToken(email);
        String extractedEmail = jwtUtil.extractEmail(token);

        assertEquals(email, extractedEmail);
    }

    @Test
    void generateToken_shouldBeValid() {
        String token = jwtUtil.generateToken("test@example.com");

        assertTrue(jwtUtil.isTokenValid(token));
    }

    @Test
    void invalidToken_shouldNotBeValid() {
        String fakeToken = "ceci.nest.pasUnVraiToken";

        assertFalse(jwtUtil.isTokenValid(fakeToken));
    }
} 