package com.typelegal.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import java.util.Map;
import java.util.List;

@Service
public class DirectusService {

    private final RestTemplate restTemplate;
    private final DataProcessingService dataProcessingService;

    // application.properties 값 주입
    @Value("${directus.api.url}")
    private String directusApiUrl;

    @Value("${directus.api.token}")
    private String accessToken;

    public DirectusService(RestTemplate restTemplate, DataProcessingService dataProcessingService) {
        this.restTemplate = restTemplate;
        this.dataProcessingService = dataProcessingService;
    }

    public Map<String, Object> fetchProcessedData() {
        List<Map<String, Object>> clauseData = fetchDirectusData("clause_template");
        List<Map<String, Object>> questionData = fetchDirectusData("question_template");

        return dataProcessingService.processData(clauseData, questionData);
    }


    private List<Map<String, Object>> fetchDirectusData(String collectionName) {
        String url = directusApiUrl + "/items/" + collectionName;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response =
                restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

        Map<String, Object> responseBody = response.getBody();
        return responseBody != null && responseBody.containsKey("data")
                ? (List<Map<String, Object>>) responseBody.get("data")
                : List.of();
    }

    /**
     * Directus API에서 데이터를 가져오는 메서드
     *
     * @return Directus에서 받아온 JSON 데이터를 Map 형태로 반환
     */
    public Map<String, Object> fetchQuestionTemplates() {
        String url = directusApiUrl + "/items/question_template"; // API 엔드포인트 설정

        // 요청 헤더 설정 (Authorization 포함)
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        // 요청 엔티티 생성
        HttpEntity<String> entity = new HttpEntity<>(headers);

        // Directus API 호출 (GET 요청)
        ResponseEntity<Map> response =
                restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

        return response.getBody(); // API 응답 데이터 반환
    }

    /**
     * Directus에서 clause_template 데이터를 가져오는 메서드
     *
     * @return Directus에서 받아온 JSON 데이터를 Map 형태로 반환
     */
    public Map<String, Object> fetchClauseTemplates() {
        String url = directusApiUrl + "/items/clause_template"; // API 엔드포인트 설정

        // 요청 헤더 설정 (Authorization 포함)
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        // 요청 엔티티 생성
        HttpEntity<String> entity = new HttpEntity<>(headers);

        // Directus API 호출 (GET 요청)
        ResponseEntity<Map> response =
                restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

        return response.getBody(); // API 응답 데이터 반환
    }
}
