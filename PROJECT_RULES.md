# Shalmal v2 - Project Rules

## Overview
This document defines the development standards, conventions, and rules for the Shalmal v2 Spring Boot application.

## Technology Stack
- **Java**: JDK 17
- **Framework**: Spring Boot 3.2.0
- **Build Tool**: Maven
- **Database**: H2 (development), MySQL (production)
- **Testing**: JUnit 5, Mockito, Spring Boot Test

## Code Standards

### Java Coding Conventions
- Follow **Oracle Java Code Conventions**
- Use **camelCase** for variables and methods
- Use **PascalCase** for classes and interfaces
- Use **UPPER_SNAKE_CASE** for constants
- Maximum line length: **120 characters**
- Use meaningful variable and method names
- Avoid abbreviations unless they are widely understood

### Package Structure
```
com.shalmal.shalmal_v2/
├── controller/          # REST controllers
├── service/            # Business logic services
├── repository/         # Data access layer
├── model/              # Entity models
├── dto/                # Data Transfer Objects
├── config/             # Configuration classes
├── exception/          # Custom exceptions
├── util/               # Utility classes
└── ShalmalV2Application.java
```

### Naming Conventions
- **Controllers**: `{Entity}Controller` (e.g., `UserController`)
- **Services**: `{Entity}Service` (e.g., `UserService`)
- **Repositories**: `{Entity}Repository` (e.g., `UserRepository`)
- **Entities**: `{Entity}` (e.g., `User`)
- **DTOs**: `{Entity}Dto` (e.g., `UserDto`)
- **Exceptions**: `{Entity}Exception` (e.g., `UserNotFoundException`)

## Spring Boot Conventions

### Controller Rules
- Use `@RestController` for REST APIs
- Use `@RequestMapping` at class level for base path
- Use specific HTTP method annotations (`@GetMapping`, `@PostMapping`, etc.)
- Always use `@Valid` for request validation and don't check nullablity again in method.
- Return `ResponseEntity<T>` for proper HTTP status codes
- Use `@PathVariable` for path parameters
- Use `@RequestParam` for query parameters
- Use `@RequestBody` for request body

### Service Layer Rules
- Use `@Service` annotation
- Keep business logic in service layer, not in controllers
- Use `@Transactional` for database operations
- Handle exceptions and throw custom exceptions when needed
- Keep services focused on single responsibility

### Repository Rules
- Extend `JpaRepository<Entity, ID>` for JPA repositories
- Use `@Repository` annotation (optional with Spring Boot)
- Use method naming conventions for query methods when needed
- Use `@Query` for custom queries when needed

### Entity Rules
- Use `@Entity` annotation
- Use `@Table` for custom table names
- Use `@Id` and `@GeneratedValue` for primary keys
- Use appropriate JPA annotations (`@Column`, `@OneToMany`, etc.)
- Implement `equals()` and `hashCode()` methods
- Use `@CreationTimestamp` and `@UpdateTimestamp` for audit fields
- Use Lombok
- Use `java.time` instead of `java.util.date`

## Database Rules

### Entity Design
- Use meaningful table and column names
- Use appropriate data types
- Add constraints (`@NotNull`, `@Size`, etc.)
- Use `@Enumerated` for enum fields
- Avoid using `@Lob` unless necessary

### Migration Strategy
- Use Flyway for database migrations
- Name migration files: `V{version}__{description}.sql`
- Keep migrations small and focused
- Test migrations on sample data

## Testing Standards

### Test Structure
- Use **Given-When-Then** pattern for test methods
- Use descriptive test method names: `should_{expectedBehavior}_when_{condition}`
- One assertion per test method when possible
- Use `@SpringBootTest` for integration tests
- Use `@WebMvcTest` for controller tests
- Use `@DataJpaTest` for repository tests
- Use H2 db for testing database

### Test Coverage
- Aim for **80%+ code coverage**
- Test all public methods
- only focus on the service classes and controller classes
- Test exception scenarios
- Test edge cases and boundary conditions
- Mock external dependencies

### Test Data
- Use `@TestPropertySource` for test-specific properties
- Use `@Sql` for database setup in tests
- Use builders or factories for test data creation

## API Design Rules

### REST API Conventions
- Use HTTP methods correctly:
  - `GET` for retrieving data
  - `POST` for creating resources
  - `PUT` for full updates
  - `PATCH` for partial updates
  - `DELETE` for removing resources
- Use proper HTTP status codes
- Use consistent URL patterns: `/api/v1/{resource}`
- Use plural nouns for resource names
- Use query parameters for filtering and pagination

### Response Format
```json
{
  "data": { ... },
  "message": "Success",
  "status": "SUCCESS",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [ ... ]
  },
  "status": "ERROR",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Security Rules

### Authentication & Authorization
- Use Spring Security for authentication
- Implement JWT tokens for stateless authentication
- Use role-based access control (RBAC)
- Validate all inputs
- Use HTTPS in production

### Data Protection
- Never log sensitive data (passwords, tokens, etc.)
- Use parameterized queries to prevent SQL injection
- Validate and sanitize all user inputs
- Use proper encryption for sensitive data

## Configuration Rules

### Application Properties
- Use environment-specific property files
- Use `@ConfigurationProperties` for complex configurations
- Keep sensitive data in environment variables
- Use profiles for different environments (`dev`, `test`, `prod`)

### Logging
- Use SLF4J with Logback
- Use appropriate log levels:
  - `ERROR`: System errors
  - `WARN`: Warning conditions
  - `INFO`: General information
  - `DEBUG`: Detailed information
- Don't log sensitive information
- Use structured logging with JSON format in production

## Performance Rules

### Database Performance
- Use appropriate indexes
- Avoid N+1 queries
- Use pagination for large datasets
- Use `@Transactional(readOnly = true)` for read-only operations
- Use connection pooling

### Application Performance
- Use caching where appropriate (`@Cacheable`)
- Optimize database queries
- Use lazy loading for JPA relationships
- Monitor application metrics with Actuator

## Documentation Rules

### Code Documentation
- Use JavaDoc for public APIs
- Keep comments up-to-date with code changes
- Use meaningful commit messages
- Document complex business logic

### API Documentation
- Use OpenAPI/Swagger for API documentation
- Provide examples for all endpoints
- Document error responses
- Keep documentation synchronized with code

## Git Workflow Rules

### Branch Strategy
- Use `main` branch for production-ready code
- Use feature branches: `feature/{feature-name}`
- Use hotfix branches: `hotfix/{issue-description}`
- Use release branches: `release/{version}`

### Commit Messages
- Use conventional commit format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Keep commit messages concise and descriptive
- Reference issue numbers when applicable

### Code Review
- All code must be reviewed before merging
- Review for functionality, security, and performance
- Check for code style compliance
- Ensure tests are included and passing

## Deployment Rules

### Environment Configuration
- Use different profiles for different environments
- Keep production secrets secure
- Use environment variables for configuration
- Monitor application health and performance

### Build and Deployment
- Use Maven for building
- Run all tests before deployment
- Use Docker for containerization
- Implement CI/CD pipeline
- Use blue-green deployment for zero downtime

## Monitoring and Observability

### Health Checks
- Implement health check endpoints
- Monitor database connectivity
- Monitor external service dependencies
- Use Spring Boot Actuator

### Logging and Metrics
- Use structured logging
- Implement application metrics
- Monitor performance indicators
- Set up alerting for critical issues

## Development Workflow

### Feature Development Process
1. Create feature branch from `main`
2. Implement feature with tests
3. Create pull request
4. Code review
5. Merge to `main`
6. Deploy to staging
7. Deploy to production

### Bug Fix Process
1. Create hotfix branch from `main`
2. Fix bug with tests
3. Create pull request
4. Code review
5. Merge to `main`
6. Deploy fix immediately

## Code Quality Rules

### Static Analysis
- Use SonarQube for code quality analysis
- Fix all critical and major issues
- Maintain code coverage above 80%
- Use Checkstyle for code style validation

### Dependencies
- Keep dependencies up-to-date
- Use only necessary dependencies
- Review dependency security vulnerabilities
- Use dependency management in Maven

## Exception Handling

### Custom Exceptions
- Create specific exception classes for different error types
- Use `@ControllerAdvice` for global exception handling
- Provide meaningful error messages
- Log exceptions with appropriate level

### Error Handling Strategy
- Don't expose internal implementation details
- Return appropriate HTTP status codes
- Provide helpful error messages to clients
- Log detailed error information for debugging

---

## Compliance and Maintenance

These rules should be followed by all team members. Regular reviews and updates of these rules should be conducted to ensure they remain relevant and effective.

**Last Updated**: January 2024
**Version**: 1.0
