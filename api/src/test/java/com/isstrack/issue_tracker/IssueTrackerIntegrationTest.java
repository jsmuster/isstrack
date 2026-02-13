package com.isstrack.issue_tracker;

import static org.assertj.core.api.Assertions.assertThat;

import com.isstrack.issue_tracker.api.dto.AuthResponse;
import com.isstrack.issue_tracker.api.dto.CreateIssueRequest;
import com.isstrack.issue_tracker.api.dto.CreateProjectRequest;
import com.isstrack.issue_tracker.api.dto.IssueDetailDto;
import com.isstrack.issue_tracker.api.dto.IssueDto;
import com.isstrack.issue_tracker.api.dto.LoginRequest;
import com.isstrack.issue_tracker.api.dto.PageResponse;
import com.isstrack.issue_tracker.api.dto.PatchIssueRequest;
import com.isstrack.issue_tracker.api.dto.RegisterRequest;
import java.util.List;
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
class IssueTrackerIntegrationTest {
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

  @Test
  void fullIssueLifecycleWithFilters() {
    AuthResponse auth = registerAndLogin();
    String token = auth.accessToken();

    Long projectId = createProject(token);

    IssueDto issue = createIssue(token, projectId);
    assertThat(issue.projectId()).isEqualTo(projectId);

    PageResponse issues = listIssues(token, projectId, "OPEN", "test");
    assertThat(issues.totalElements()).isEqualTo(1);

    updateIssueStatus(token, issue.id(), "IN_PROGRESS");

    IssueDetailDto detail = getIssueDetail(token, issue.id());
    assertThat(detail.activity().items().stream().anyMatch(a -> a.message().contains("IN_PROGRESS"))).isTrue();
  }

  private AuthResponse registerAndLogin() {
    RegisterRequest register = new RegisterRequest(
        "user@example.com",
        "user1",
        "Password123!",
        "Test",
        "User"
    );
    restTemplate.postForEntity(url("/api/auth/register"), register, AuthResponse.class);
    LoginRequest login = new LoginRequest("user1", "Password123!");
    ResponseEntity<AuthResponse> response = restTemplate.postForEntity(url("/api/auth/login"), login, AuthResponse.class);
    return response.getBody();
  }

  private Long createProject(String token) {
    CreateProjectRequest request = new CreateProjectRequest("Test Project");
    ResponseEntity<com.isstrack.issue_tracker.api.dto.ProjectDto> response = restTemplate.exchange(
        url("/api/projects"),
        HttpMethod.POST,
        new HttpEntity<>(request, authHeaders(token)),
        com.isstrack.issue_tracker.api.dto.ProjectDto.class
    );
    return response.getBody().id();
  }

  private IssueDto createIssue(String token, Long projectId) {
    CreateIssueRequest request = new CreateIssueRequest(
        "Test Issue",
        "Description",
        "HIGH",
        null,
        List.of("backend")
    );
    ResponseEntity<IssueDto> response = restTemplate.exchange(
        url("/api/projects/" + projectId + "/issues"),
        HttpMethod.POST,
        new HttpEntity<>(request, authHeaders(token)),
        IssueDto.class
    );
    return response.getBody();
  }

  private PageResponse listIssues(String token, Long projectId, String status, String query) {
    ResponseEntity<PageResponse> response = restTemplate.exchange(
        url("/api/projects/" + projectId + "/issues?status=" + status + "&q=" + query),
        HttpMethod.GET,
        new HttpEntity<>(authHeaders(token)),
        PageResponse.class
    );
    return response.getBody();
  }

  private void updateIssueStatus(String token, Long issueId, String status) {
    PatchIssueRequest request = new PatchIssueRequest(null, null, status, null, null, null, null);
    restTemplate.exchange(
        url("/api/issues/" + issueId),
        HttpMethod.PATCH,
        new HttpEntity<>(request, authHeaders(token)),
        IssueDto.class
    );
  }

  private IssueDetailDto getIssueDetail(String token, Long issueId) {
    ResponseEntity<IssueDetailDto> response = restTemplate.exchange(
        url("/api/issues/" + issueId),
        HttpMethod.GET,
        new HttpEntity<>(authHeaders(token)),
        IssueDetailDto.class
    );
    return response.getBody();
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
