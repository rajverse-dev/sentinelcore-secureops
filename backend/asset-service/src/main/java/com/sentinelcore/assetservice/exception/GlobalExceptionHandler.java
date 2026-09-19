package com.sentinelcore.assetservice.exception;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;



@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthentication(
            AuthenticationException exception,
            HttpServletRequest request) {

        ErrorResponse response =
                new ErrorResponse(
                        401,
                        "Unauthorized",
                        exception.getMessage(),
                        request.getRequestURI()
                );

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }

    @ExceptionHandler(EmailAlreadyExistsExcepiton.class)
    public ResponseEntity<ErrorResponse> handleDuplicateEmail(
            EmailAlreadyExistsExcepiton exception,
            HttpServletRequest request) {

        ErrorResponse response =
                new ErrorResponse(
                        409,
                        "Conflict",
                        exception.getMessage(),
                        request.getRequestURI()
                );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }

    @ExceptionHandler(VulnerabilityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleVulnerabilityNotFound(
            VulnerabilityNotFoundException exception,
            HttpServletRequest request) {

        ErrorResponse response =
                new ErrorResponse(
                        404,
                        "Not Found",
                        exception.getMessage(),
                        request.getRequestURI());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    @ExceptionHandler(AssetNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleAssetNotFound(
            AssetNotFoundException exception,
            HttpServletRequest request) {

        ErrorResponse response =
                new ErrorResponse(
                        404,
                        "Not Found",
                        exception.getMessage(),
                        request.getRequestURI());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    @ExceptionHandler(DuplicateVulnerabilityException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateVulnerability(
            DuplicateVulnerabilityException exception,
            HttpServletRequest request) {

        ErrorResponse response =
                new ErrorResponse(
                        409,
                        "Conflict",
                        exception.getMessage(),
                        request.getRequestURI());

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }

    @ExceptionHandler(CveNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCveNotFound(
            CveNotFoundException exception,
            HttpServletRequest request) {

        ErrorResponse response =
                new ErrorResponse(
                        404,
                        "Not Found",
                        exception.getMessage(),
                        request.getRequestURI());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    @ExceptionHandler(DuplicateCveException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateCve(
            DuplicateCveException exception,
            HttpServletRequest request) {

        ErrorResponse response =
                new ErrorResponse(
                        409,
                        "Conflict",
                        exception.getMessage(),
                        request.getRequestURI());

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }

    @ExceptionHandler(CveInUseException.class)
    public ResponseEntity<ErrorResponse> handleCveInUse(
            CveInUseException exception,
            HttpServletRequest request) {

        ErrorResponse response =
                new ErrorResponse(
                        409,
                        "Conflict",
                        exception.getMessage(),
                        request.getRequestURI());

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }

    @ExceptionHandler(CveIdentifierMismatchException.class)
    public ResponseEntity<ErrorResponse> handleCveIdentifierMismatch(
            CveIdentifierMismatchException exception,
            HttpServletRequest request) {

        ErrorResponse response =
                new ErrorResponse(
                        400,
                        "Bad Request",
                        exception.getMessage(),
                        request.getRequestURI());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @ExceptionHandler(InvalidPatchTransitionException.class)
    public ResponseEntity<ErrorResponse> handleInvalidPatchTransition(
            InvalidPatchTransitionException exception,
            HttpServletRequest request) {

        ErrorResponse response =
                new ErrorResponse(
                        400,
                        "Bad Request",
                        exception.getMessage(),
                        request.getRequestURI());

        return ResponseEntity
                .badRequest()
                .body(response);
    }

        @ExceptionHandler(IncidentNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleIncidentNotFound(
                        IncidentNotFoundException exception,
                        HttpServletRequest request) {
                return incidentError(HttpStatus.NOT_FOUND, "Not Found", exception.getMessage(), request);
        }

        @ExceptionHandler(DuplicateIncidentException.class)
        public ResponseEntity<ErrorResponse> handleDuplicateIncident(
                        DuplicateIncidentException exception,
                        HttpServletRequest request) {
                return incidentError(HttpStatus.CONFLICT, "Conflict", exception.getMessage(), request);
        }

        @ExceptionHandler(InvalidIncidentTransitionException.class)
        public ResponseEntity<ErrorResponse> handleInvalidIncidentTransition(
                        InvalidIncidentTransitionException exception,
                        HttpServletRequest request) {
                return incidentError(HttpStatus.BAD_REQUEST, "Bad Request", exception.getMessage(), request);
        }

        private ResponseEntity<ErrorResponse> incidentError(
                        HttpStatus status,
                        String error,
                        String message,
                        HttpServletRequest request) {
                return ResponseEntity.status(status).body(
                                new ErrorResponse(status.value(), error, message, request.getRequestURI()));
        }

    @ExceptionHandler(InvalidTrivyScanException.class)
    public ResponseEntity<ErrorResponse> handleInvalidTrivyScan(
            InvalidTrivyScanException exception,
            HttpServletRequest request) {

        ErrorResponse response =
                new ErrorResponse(
                        400,
                        "Bad Request",
                        exception.getMessage(),
                        request.getRequestURI());

        return ResponseEntity
                .badRequest()
                .body(response);
    }

    @ExceptionHandler(TrivyUnavailableException.class)
    public ResponseEntity<ErrorResponse> handleTrivyUnavailable(
            TrivyUnavailableException exception,
            HttpServletRequest request) {

        ErrorResponse response =
                new ErrorResponse(
                        503,
                        "Service Unavailable",
                        exception.getMessage(),
                        request.getRequestURI());

        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(response);
    }

    @ExceptionHandler(TrivyExecutionException.class)
    public ResponseEntity<ErrorResponse> handleTrivyExecution(
            TrivyExecutionException exception,
            HttpServletRequest request) {

        ErrorResponse response =
                new ErrorResponse(
                        500,
                        "Internal Server Error",
                        exception.getMessage(),
                        request.getRequestURI());

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }

    @ExceptionHandler(InvalidSonarQubeResponseException.class)
    public ResponseEntity<ErrorResponse> handleInvalidSonarQubeResponse(
            InvalidSonarQubeResponseException exception,
            HttpServletRequest request) {

        ErrorResponse response =
                new ErrorResponse(
                        400,
                        "Bad Request",
                        exception.getMessage(),
                        request.getRequestURI());

        return ResponseEntity
                .badRequest()
                .body(response);
    }

    @ExceptionHandler(SonarQubeConfigurationException.class)
    public ResponseEntity<ErrorResponse> handleSonarQubeConfiguration(
            SonarQubeConfigurationException exception,
            HttpServletRequest request) {

        ErrorResponse response =
                new ErrorResponse(
                        503,
                        "Service Unavailable",
                        exception.getMessage(),
                        request.getRequestURI());

        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(response);
    }

    @ExceptionHandler(SonarQubeUnavailableException.class)
    public ResponseEntity<ErrorResponse> handleSonarQubeUnavailable(
            SonarQubeUnavailableException exception,
            HttpServletRequest request) {

        ErrorResponse response =
                new ErrorResponse(
                        503,
                        "Service Unavailable",
                        exception.getMessage(),
                        request.getRequestURI());

        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException exception,
            HttpServletRequest request) {

        String message = exception
                .getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error ->
                        error.getField()
                                + ": "
                                + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        ErrorResponse response =
                new ErrorResponse(
                        400,
                        "Bad Request",
                        message,
                        request.getRequestURI()
                );

        return ResponseEntity
                .badRequest()
                .body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(
            Exception exception,
            HttpServletRequest request) {

        ErrorResponse response =
                new ErrorResponse(
                        500,
                        "Internal Server Error",
                        "An unexpected error occurred",
                        request.getRequestURI()
                );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }
}
