package com.typelegal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable()).cors(withDefaults()) // CORS 활성화
        .authorizeHttpRequests(
            auth -> auth.requestMatchers("/api/**").permitAll().anyRequest().authenticated())
        .httpBasic(basic -> basic.disable());

    return http.build();
  }
}
