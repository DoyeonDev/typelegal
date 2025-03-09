// controller/: HTTP 요청을 처리하는 컨트롤러 클래스들이 위치하는 디렉토리. ClauseTemplateController.java는 API 엔드포인트를 제공하는
// 역할.

package com.typelegal.controller;

import com.typelegal.model.ClauseTemplate;
import com.typelegal.repository.ClauseTemplateRepository;
import com.typelegal.service.ClauseTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clause-template")
public class ClauseTemplateController {

    @Autowired
    private ClauseTemplateService clauseTemplateService;

    // 🔥 모든 데이터 가져오기 (findAll)
    @GetMapping("/all")
    public List<ClauseTemplate> getAllClauseTemplates() {
        System.out.println("adad");
        return clauseTemplateService.getAllClauseTemplates();

        // List<ClauseTemplate> result = clauseTemplateService.getAllClauseTemplates();
        // return ResponseEntity.ok(result);
    }

    @GetMapping("/filtered")
    public ResponseEntity<List<ClauseTemplate>> getFilteredClauses(@RequestParam String query1,
            @RequestParam String query2) {
        List<ClauseTemplate> result = clauseTemplateService.getFilteredClauses(query1, query2);
        return ResponseEntity.ok(result);
    }
}
