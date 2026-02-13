package com.isstrack.issue_tracker.domain.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.isstrack.issue_tracker.api.dto.AuthResponse;
import com.isstrack.issue_tracker.api.dto.CreateIssueRequest;
import com.isstrack.issue_tracker.api.dto.CreateProjectRequest;
import com.isstrack.issue_tracker.api.dto.PatchIssueRequest;
import com.isstrack.issue_tracker.api.dto.RegisterRequest;
import com.isstrack.issue_tracker.persistence.repo.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class AssigneeValidationIntegrationTest {
  @Container
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
      .withDatabaseName("issuetracker")
      .withUsername("issuetracker")
      .withPassword("issuetracker");

  @DynamicPropertySource
  static void configureProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", postgres::getJdbcUrl);
    registry.add("spring.datasource.username", postgres::getUsername);
    registry.add("spring.datasource.password", postgres::getPassword);
    registry.add("app.jwt.secret", () -> "TEST_SECRET_12345678901234567890123456789012");
  }

  @LocalServerPort
  int port;

  @Autowired
  TestRestTemplate restTemplate;

  @Autowired
  UserRepository userRepository;

  @Test
  void patchAssignNonMemberReturnsBadRequest() {
    String ownerToken = register("owner@example.com", "owner1");
    register("other@example.com", "other1");
    Long otherUserId = userRepository.findByEmailIgnoreCase("other@example.com").orElseThrow().getId();

    Long projectId = createProject(ownerToken);
    Long issueId = createIssue(ownerToken, projectId);

    PatchIssueRequest request = new PatchIssueRequest(null, null, null, null, otherUserId, null, null);
    ResponseEntity<String> response = restTemplate.exchange(
        url("/api/issues/" + issueId),
        HttpMethod.PATCH,
        new HttpEntity<>(request, authHeaders(ownerToken)),
        String.class
    );

    assertThat(response.getStatusCode().value()).isEqualTo(400);
    assertThat(response.getBody()).contains("Assignee must be an active member of the project");
  }

  private String register(String email, String username) {
    RegisterRequest register = new RegisterRequest(email, username, "Password123!", "Test", "User");
    ResponseEntity<AuthResponse> response = restTemplate.postForEntity(url("/api/auth/register"), register, AuthResponse.class);
    return response.getBody().accessToken();
  }

  private Long createProject(String token) {
    CreateProjectRequest request = new CreateProjectRequest("Project");
    ResponseEntity<com.isstrack.issue_tracker.api.dto.ProjectDto> response = restTemplate.exchange(
        url("/api/projects"),
        HttpMethod.POST,
        new HttpEntity<>(request, authHeaders(token)),
        com.isstrack.issue_tracker.api.dto.ProjectDto.class
    );
    return response.getBody().id();
  }

  private Long createIssue(String token, Long projectId) {
    CreateIssueRequest request = new CreateIssueRequest("Issue", "Desc", "LOW", null, null);
    ResponseEntity<com.isstrack.issue_tracker.api.dto.IssueDto> response = restTemplate.exchange(
        url("/api/projects/" + projectId + "/issues"),
        HttpMethod.POST,
        new HttpEntity<>(request, authHeaders(token)),
        com.isstrack.issue_tracker.api.dto.IssueDto.class
    );
    return response.getBody().id();
  }

  private HttpHeaders authHeaders(String token) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBearerAuth(token);
    return headers;
  }

  private String url(String path) {
    return "http://localhost:" + port + path;
  }
}
