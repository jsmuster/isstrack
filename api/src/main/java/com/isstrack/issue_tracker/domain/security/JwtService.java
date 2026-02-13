package com.isstrack.issue_tracker.domain.security;

import com.isstrack.issue_tracker.persistence.entity.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private final SecretKey secretKey;
  private final String issuer;
  private final int expirationMinutes;

  public JwtService(
      @Value("${app.jwt.secret}") String secret,
      @Value("${app.jwt.issuer}") String issuer,
      @Value("${app.jwt.expirationMinutes}") int expirationMinutes
  ) {
    this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.issuer = issuer;
    this.expirationMinutes = expirationMinutes;
  }

  public String generateToken(UserEntity user) {
    var now = Instant.now();
    return Jwts.builder()
        .setSubject(String.valueOf(user.getId()))
        .setIssuer(issuer)
        .setIssuedAt(Date.from(now))
        .setExpiration(Date.from(now.plus(expirationMinutes, ChronoUnit.MINUTES)))
        .claim("role", user.getRole().getName())
        .claim("username", user.getUsername())
        .signWith(secretKey, SignatureAlgorithm.HS256)
        .compact();
  }

  public boolean validateToken(String token) {
    try {
      parseClaims(token);
      return true;
    } catch (Exception ex) {
      return false;
    }
  }

  public long extractUserId(String token) {
    return Long.parseLong(parseClaims(token).getSubject());
  }

  public String extractRole(String token) {
    return parseClaims(token).get("role", String.class);
  }

  private Claims parseClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(secretKey)
        .build()
        .parseClaimsJws(token)
        .getBody();
  }
}
