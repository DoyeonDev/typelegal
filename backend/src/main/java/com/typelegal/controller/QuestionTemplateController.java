// controller/: HTTP 요청을 처리하는 컨트롤러 클래스들이 위치하는 디렉토리. ClauseTemplateController.java는 API 엔드포인트를 제공하는
// 역할.

package com.typelegal.controller;

import com.typelegal.model.QuestionTemplate;
import com.typelegal.repository.QuestionTemplateRepository;
import com.typelegal.service.QuestionTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/question-template")
public class QuestionTemplateController {

    @Autowired
    private QuestionTemplateService questionTemplateService;

    // 모든 데이터 가져오기 (findAll)
    @GetMapping("/all")
    public List<QuestionTemplate> getAllQuestionTemplates() {
        System.out.println("adad123");
        return questionTemplateService.getAllQuestionTemplates();
    }

    @GetMapping("/filtered")
    public ResponseEntity<List<QuestionTemplate>> getFilteredQuestions(@RequestParam String query1,
            @RequestParam String query2) {
        List<QuestionTemplate> result =
                questionTemplateService.getFilteredQuestions(query1, query2);
        return ResponseEntity.ok(result);
    }
}
