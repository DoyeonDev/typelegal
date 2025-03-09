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

            private final DataProcessingService dataProcessingServ
            private final ClauseTemplateService clauseTemplateServ
            private final QuestionTemplateService questionTemplateServ

            @Autow
            public DataProcessingController(DataProcessingService dataProcessingServ
                                    ClauseTemplateService clauseTemp
                                    QuestionTemplateService questionTempla
                        this.dataProcessingService = dataProcessing
                        this.clauseTemplateService = clauseTemplate
                        this.questionTemplateService = questionTemplate
         

           
             * API 엔드포인트: 데이터를 가져와 가공한 후 반환 query1, query2를 활용한 필터
           
            @GetMapping("/proce
            public ResponseEntity<Map<String, Object>> processData(@RequestParam String que
                                    @RequestParam Stri

                        // 1. clause_template & question_template 데이터 조회 (query1, query2
                        List<ClauseTemplate> clauseTem
                                                clauseTemplateService.getFilteredClauses(
                        List<QuestionTemplate> questionTem
                                                questionTemplateService.getFilteredQuestions(

                        // 2. List<ClauseTemplate> → List<Map<String, Object>
                        List<Map<String, Object>> clauseData = clauseTemplates.
                                                .map(this::convertClauseTemplateToMap).collect(Colle

                        // 3. List<QuestionTemplate> → List<Map<String, Object>
                        List<Map<String, Object>> questi
                                nData =                questionTemplates.stream
                                                ().map(this::convertQuestionTe

                
                        // 4. 데이터 가공 서비스 실행
                                Map<String, Object> processedData =

                
                        // 5. 가공된 데이터를 클라이언트에 반환
         

        
            /**
           
             */
                private Map<String, Object> convertClauseT
                        Map<String, Object> ma
                        map.put("id", clause.get
                        map.put("cid", clause.getC
                        map.put("cidx", clause.getCidx());
                        map.put("clause_title_en", clause.getClaus
                        map.put("clause_guide", clause.getClau
                        map.put("content_en", clause.getContent_en()
                        map.put("binding_input", clause.getBinding_input()
                        map.put("binding_question", clause.getBinding_
                        map.put("clause_trigger", clause.
                        map.put("is_clause", clause.is_clau
                        map
         

        
            /**
           
             */
                private Map<String, Object> convertQuestio
                        Map<String, Object> map 
                        map.put("id", question.getId
                        map.put("midx", question.get
                        map.put("qidx", question.getQidx());
                        map.put("binding_question_ko", question.getBindi
                        map.put("binding_parent", question.getBinding_parent()
                        map.put("question_category", question.getQuestion_catego
                        map.put("question_title_tag", question.getQu
                        map.put("question_tip", question.getQuestion_tip
                        map.put("question_guide", question.ge
                        map.put("is_default", question.is
                        map.put("is_fixed", question.is_fixed());
                        map.put("question_title_ko", question.getQ
                        map.put("binding_key", question.getBinding
                        map.put("output_type", question.getOutput_type
                        map.put("question_type", question.getQuest
                        map.put("placeholder", question.ge
                        map.put("options", question.getOptions());
                        map
                    return map;
        }
}
