package com.example.backend.configs;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;
import java.util.Date;

@Configuration
public class JwtConfig {
    private final String mySecret = "de396d1c31ad2b7298b7b42ae639ee4a7ee88663738ab8d2e6d474353b7ca13ca996729627aac0bd6938e1a6bec10ab2e412f93276b245677010642df77dea74f4518dbfdcefa05eb7e5fb456d9eef78a6bb5ba1dd2292cc2157e11ecde3bbfa89dabffb8898940d3c16bd7e8790dc2b366be48486656d6008ef402d59e3da82f3a1cf8698a55393f19a14f067e422f4ada129f54de905a4b337d9413ad87a29c0458a5ca69b6656259e4bd44b4200ce34391ded6c3f474642ff7b49edcbb3dd1319c3826d91391e8c72f47d1168c72b30474aa87c57b69ca6daa138a90de78c523ab259b22585a29575022e63d5d7b1c9bf5c6ab1903dcca330f53a69b9f7f4";
    private final SecretKey secretKey = Keys.hmacShaKeyFor(mySecret.getBytes());
    private long expiration = 1000 * 60 * 60;

    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts
                .parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
