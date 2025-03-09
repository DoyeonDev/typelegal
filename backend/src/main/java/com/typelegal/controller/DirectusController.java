package com.typelegal.controller;

import com.typelegal.service.DirectusService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api/directus") // Directus 관련 API 엔드포인트 설정
public class DirectusController {

    private final DirectusService directusService;

    public DirectusController(DirectusService directusService) {
        this.directusService = directusService;
    }

    /**
     * Directus API에서 question_template 데이터를 가져오는 API 엔드포인트
     * 
     * @return ResponseEntity - Directus API에서 가져온 데이터
     */
    @GetMapping("/question-template")
    public ResponseEntity<Map<String, Object>> getQuestionTemplates() {
        Map<String, Object> response = directusService.fetchQuestionTemplates();
        return ResponseEntity.ok(response);
    }

    /**
     * Directus에서 clause_template 데이터를 가져오는 엔드포인트
     *
     * @return ResponseEntity - Directus API에서 가져온 데이터
     */
    @GetMapping("/clause-template")
    public ResponseEntity<Map<String, Object>> getClauseTemplates() {
        Map<String, Object> response = directusService.fetchClauseTemplates();
        return ResponseEntity.ok(response);
    }
}
