# SentinelCore SecureOps - Authentication Backend

This branch contains the Spring Boot authentication backend for SentinelCore SecureOps. It provides user registration, login, JWT token generation, and protected API access.

## Features

- User registration
- User login
- JWT-based authentication
- Password encryption
- Spring Security configuration
- PostgreSQL database integration
- Protected API endpoint for testing authentication
- Global exception handling
- Request validation

## Tech Stack

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT
- Maven

## Project Structure

```text
backend/
  asset-service/
    src/main/java/com/sentinelcore/assetservice/
      controller/
      dto/
      entity/
      exception/
      repository/
      security/
      service/