package com.sharemal;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main Spring Boot application class for Shalmal v2
 */
@Slf4j
@SpringBootApplication
@EnableJpaAuditing
public class ShalmalV2Application {

    public static void main(String[] args) {
        log.info("Starting Shalmal v2 application...");
        SpringApplication.run(ShalmalV2Application.class, args);
        log.info("Shalmal v2 application started successfully!");
    }
}
