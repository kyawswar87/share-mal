# Shalmal v2

A Spring Boot application built with Java 17 and Maven, following enterprise-grade development standards.

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0+ (for production)

## Getting Started

### Running the Application

1. Clone or navigate to the project directory:
   ```bash
   cd share-mal
   ```

2. Run the application using Maven:
   ```bash
   mvnw spring-boot:run
   ```

   Or build and run the JAR:
   ```bash
   mvnw clean package
   java -jar target/shalmal_v2-0.0.1-SNAPSHOT.jar
   ```

3. The application will start on `http://localhost:8080`

### Available Endpoints

- **API Documentation**: `http://localhost:8080/swagger-ui.html`
- **Health Check**: `http://localhost:8080/actuator/health`
- **Application Info**: `http://localhost:8080/actuator/info`
- **H2 Database Console**: `http://localhost:8080/h2-console` (development only)

### API Endpoints

- **Users API**: `http://localhost:8080/api/v1/users`
  - `GET /api/v1/users` - Get all users
  - `GET /api/v1/users/{id}` - Get user by ID
  - `GET /api/v1/users/username/{username}` - Get user by username
  - `POST /api/v1/users` - Create new user
  - `PUT /api/v1/users/{id}` - Update user
  - `DELETE /api/v1/users/{id}` - Delete user
  - `GET /api/v1/users/status/{status}` - Get users by status

### Database

#### Development (H2)
- **JDBC URL**: `jdbc:h2:mem:testdb`
- **Username**: `sa`
- **Password**: `password`
- **Console**: `http://localhost:8080/h2-console`

#### Production (MySQL)
- **JDBC URL**: `jdbc:mysql://localhost:3306/shalmal_v2`
- **Username**: Set via `DB_USERNAME` environment variable
- **Password**: Set via `DB_PASSWORD` environment variable

## Project Structure

```
shalmal_v2/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/shalmal/shalmal_v2/
│   │   │       ├── controller/          # REST controllers
│   │   │       ├── service/            # Business logic services
│   │   │       ├── repository/         # Data access layer
│   │   │       ├── model/              # Entity models
│   │   │       ├── dto/                # Data Transfer Objects
│   │   │       ├── config/             # Configuration classes
│   │   │       ├── exception/          # Custom exceptions
│   │   │       ├── util/               # Utility classes
│   │   │       └── ShalmalV2Application.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
│           └── com/shalmal/shalmal_v2/
│               ├── controller/          # Controller tests
│               ├── service/            # Service tests
│               ├── repository/         # Repository tests
│               └── ...
├── pom.xml
├── PROJECT_RULES.md
└── README.md
```

## Dependencies

- **Spring Boot 3.2.0** - Main framework
- **Spring Web** - REST API support
- **Spring Data JPA** - Database operations
- **Spring Boot Validation** - Input validation
- **Spring Boot Actuator** - Monitoring and health checks
- **Lombok** - Code generation
- **H2 Database** - Development database
- **MySQL Connector** - Production database
- **SpringDoc OpenAPI** - API documentation
- **Spring Boot DevTools** - Development tools
- **JUnit 5** - Testing framework
- **Mockito** - Mocking framework

## Features

### ✅ Implemented Features
- **RESTful API** with proper HTTP status codes
- **Global Exception Handling** with `@ControllerAdvice`
- **Input Validation** using Bean Validation
- **API Documentation** with Swagger/OpenAPI
- **Database Integration** with JPA/Hibernate
- **Audit Fields** (created_at, updated_at, version)
- **Lombok Integration** for cleaner code
- **Profile-based Configuration** (dev, test, prod)
- **CORS Configuration** for frontend integration
- **Comprehensive Testing** with unit tests
- **Standardized Response Format** for all APIs

### 🏗️ Architecture
- **Layered Architecture**: Controller → Service → Repository
- **DTO Pattern** for data transfer
- **Exception Hierarchy** with custom exceptions
- **Configuration Management** with profiles
- **Audit Support** with JPA auditing

## Development

### Running Tests
```bash
# Run all tests
mvn test

# Run tests with coverage
mvn test jacoco:report

# Run specific test class
mvn test -Dtest=UserServiceTest
```

### Code Quality
- **Lombok** for reducing boilerplate code
- **Validation** with Bean Validation annotations
- **Logging** with SLF4J and Logback
- **Exception Handling** with global exception handler
- **API Documentation** with OpenAPI/Swagger

### Database Migrations
The project is configured to use Flyway for database migrations (when implemented):
- Migration files: `V{version}__{description}.sql`
- Location: `src/main/resources/db/migration/`

## Configuration

### Profiles
- **dev** (default): H2 database, debug logging
- **test**: H2 database, test-specific configuration
- **prod**: MySQL database, production logging

### Environment Variables
- `DB_USERNAME`: MySQL username (production)
- `DB_PASSWORD`: MySQL password (production)
- `SPRING_PROFILES_ACTIVE`: Active profile

## Building for Production

```bash
# Build with production profile
mvn clean package -Pprod

# Run with production profile
java -jar target/shalmal_v2-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

## API Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Success",
  "status": "SUCCESS",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Response
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

## Contributing

Please read [PROJECT_RULES.md](PROJECT_RULES.md) for development standards and conventions.

## License

This project is licensed under the MIT License.
