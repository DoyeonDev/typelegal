package com.typelegal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication // Spring Boot 애플리케이션 설정 (자동 설정 포함)
public class BackendApplication {
    public static void main(String[] args) {
        // .env 파일 로드
        Dotenv dotenv = Dotenv.load();
        System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
        System.setProperty("DIRECTUS_API_TOKEN", dotenv.get("DIRECTUS_API_TOKEN"));
        System.setProperty("SPRING_SECURITY_USER", dotenv.get("SPRING_SECURITY_USER"));
        System.setProperty("SPRING_SECURITY_PASS", dotenv.get("SPRING_SECURITY_PASS"));
        
        SpringApplication.run(BackendApplication.class, args); // Spring Boot 서버 실행
    }
}
