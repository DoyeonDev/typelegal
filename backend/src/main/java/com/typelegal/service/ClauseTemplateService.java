// service/: 비즈니스 로직을 처리하는 서비스 클래스들이 위치하는 디렉토리. ClauseTemplateService.java는 데이터베이스에서 데이터를 가져오는 역할.

package com.typelegal.service;

import com.typelegal.model.ClauseTemplate;
import com.typelegal.repository.ClauseTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;

@Service
public class ClauseTemplateService {

    @Autowired
    private ClauseTemplateRepository clauseTemplateRepository;

    public List<ClauseTemplate> getAllClauseTemplates() {
        System.out.println("🔥 [Service] findAllclause() 실행됨");

        List<ClauseTemplate> list = clauseTemplateRepository.findAll();
        System.out.println("🔥 Retrieved Data Size: " + list.size());
        list.forEach(item -> System.out.println("🔥 Data: " + item.getCid()));

        return clauseTemplateRepository.findAll();
    }

    public List<ClauseTemplate> getFilteredClauses(String query1, String query2) {
        System.out.println("[Service] findFilteredClauses() 실행됨");

        List<ClauseTemplate> list = clauseTemplateRepository.findByCustomConditions(query1, query2);
        System.out.println("🔥 Retrieved Filtered Data Size: " + list.size());
        list.forEach(item -> System.out.println("Filtered Data: " + item.getCid()));

        return list;
    }
}
