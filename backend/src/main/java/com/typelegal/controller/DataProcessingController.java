package com.typelegal.controller;

import com.typelegal.model.ClauseTemplate;
import com.typelegal.model.QuestionTemplate;
import com.typelegal.service.ClauseTemplateService;
import com.typelegal.service.DataProcessingService;
import com.typelegal.service.QuestionTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/data")
public class DataProcessingController {

    private final DataProcessingService dataProcessingService;
    private final ClauseTemplateService clauseTemplateService;
    private final QuestionTemplateService questionTemplateService;

    @Autowired
    public DataProcessingController(DataProcessingService dataProcessingService,
            ClauseTemplateService clauseTemplateService,
            QuestionTemplateService questionTemplateService) {
        this.dataProcessingService = dataProcessingService;
        this.clauseTemplateService = clauseTemplateService;
        this.questionTemplateService = questionTemplateService;
    }

    /**
     * API 엔드포인트: 데이터를 가져와 가공한 후 반환 query1, query2를 활용한 필터링 추가
     */
    @GetMapping("/process")
    public ResponseEntity<Map<String, Object>> processData(@RequestParam String query1,
            @RequestParam String query2) {

        // 🔹 1️⃣ clause_template & question_template 데이터 조회 (query1, query2 적용)
        List<ClauseTemplate> clauseTemplates =
                clauseTemplateService.getFilteredClauses(query1, query2);
        List<QuestionTemplate> questionTemplates =
                questionTemplateService.getFilteredQuestions(query1, query2);

        // 🔹 2️⃣ List<ClauseTemplate> → List<Map<String, Object>> 변환
        List<Map<String, Object>> clauseData = clauseTemplates.stream()
                .map(this::convertClauseTemplateToMap).collect(Collectors.toList());

        // 🔹 3️⃣ List<QuestionTemplate> → List<Map<String, Object>> 변환
        List<Map<String, Object>> questionData = questionTemplates.stream()
                .map(this::convertQuestionTemplateToMap).collect(Collectors.toList());

        // 🔹 4️⃣ 데이터 가공 서비스 실행
        Map<String, Object> processedData =
                dataProcessingService.processData(clauseData, questionData);

        // 🔹 5️⃣ 가공된 데이터를 클라이언트에 반환
        return ResponseEntity.ok(processedData);
    }

    /**
     * ClauseTemplate 객체를 Map으로 변환
     */
    private Map<String, Object> convertClauseTemplateToMap(ClauseTemplate clause) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", clause.getId());
        map.put("cid", clause.getCid());
        map.put("cidx", clause.getCidx());
        map.put("clause_title_en", clause.getClause_title_en());
        map.put("clause_guide", clause.getClause_guide());
        map.put("content_en", clause.getContent_en());
        map.put("binding_input", clause.getBinding_input());
        map.put("binding_question", clause.getBinding_question());
        map.put("clause_trigger", clause.getClause_trigger());
        map.put("is_clause", clause.is_clause());
        map.put("is_default", clause.is_default());
        return map;
    }

    /**
     * QuestionTemplate 객체를 Map으로 변환
     */
    private Map<String, Object> convertQuestionTemplateToMap(QuestionTemplate question) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", question.getId());
        map.put("midx", question.getMidx());
        map.put("qidx", question.getQidx());
        map.put("binding_question_ko", question.getBinding_question_ko());
        map.put("binding_parent", question.getBinding_parent());
        map.put("question_category", question.getQuestion_category());
        map.put("question_title_tag", question.getQuestion_title_tag());
        map.put("question_tip", question.getQuestion_tip());
        map.put("question_guide", question.getQuestion_guide());
        map.put("is_default", question.is_default());
        map.put("is_fixed", question.is_fixed());
        map.put("question_title_ko", question.getQuestion_title_ko());
        map.put("binding_key", question.getBinding_key());
        map.put("output_type", question.getOutput_type());
        map.put("question_type", question.getQuestion_type());
        map.put("placeholder", question.getPlaceholder());
        map.put("options", question.getOptions());
        map.put("binding_cidx", question.getBinding_cidx());
        return map;
    }
}
