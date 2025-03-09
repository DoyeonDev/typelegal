package com.typelegal.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DataProcessingService {

    /**
     * processData 메서드: 입력 데이터를 가공하여 최종 결과를 반환
     */
    public Map<String, Object> processData(List<Map<String, Object>> clauseData,
            List<Map<String, Object>> questionData) {
        // 1. 필요한 필드만 남겨서 clause 리스트 만들기
        List<Map<String, Object>> clauseArray = preprocessClauseArray(clauseData);

        // 2. 필요한 필드만 남겨서 question 리스트 만들기
        List<Map<String, Object>> questionArray = preprocessQuestionArray(questionData);

        // 3. clause_trigger 추출
        List<List<String>> keyObj = extractClauseTriggers(clauseArray);

        // 4. binding_input 생성
        List<List<Map<String, Object>>> valueObj = generateBindingInput(keyObj);

        // 5. clause_trigger 및 binding_input을 clauseArray에 추가하고 cNo 설정
        addClauseTriggerAndBindingInput(clauseArray, keyObj, valueObj);

        // 6. input_array 생성
        List<Map<String, Object>> inputArray = generateInputArray(keyObj, questionArray);

        // 7. binding_cidx 및 placeholder 값 업데이트
        updateBindingCidxAndPlaceholders(clauseArray, questionArray, inputArray);

        // 8. content_en 내부 문자열을 <span> 태그로 변환
        updateContentWithPlaceholders(clauseArray, inputArray);

        // 9. question을 binding_question_ko 기준으로 그룹화
        Map<String, List<Map<String, Object>>> groupedQuestion =
                groupQuestionsByBindingKey(questionArray);

        // 10. glossary 데이터 정리
        // List<Map<String, Object>> glossaryArray = extractGlossary(clauseArray);

        // 11. clauseGuide 데이터 정리
        List<Map<String, Object>> clauseGuide = generateClauseGuide(clauseArray);

        // 최종 데이터 반환
        Map<String, Object> processedData = new HashMap<>();
        processedData.put("clause", clauseArray);
        processedData.put("question", questionArray);
        processedData.put("grouped_question", groupedQuestion);
        processedData.put("input_array", inputArray);
        // processedData.put("glossary", glossaryArray);
        processedData.put("clauseGuide", clauseGuide); // clauseGuide 추가

        return processedData;
    }

    /**
     * clauseData를 필요한 필드만 남긴 Map 리스트로 변환
     */
    private List<Map<String, Object>> preprocessClauseArray(List<Map<String, Object>> clauseData) {
        return clauseData.stream().map(detail -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", detail.get("id"));
            map.put("cidx", detail.get("cidx"));
            map.put("cno", detail.get("cno"));
            map.put("clause_title_en", detail.get("clause_title_en"));
            map.put("clause_guide", detail.get("clause_guide"));
            map.put("content_en", detail.get("content_en"));
            map.put("binding_input", detail.get("binding_input"));
            map.put("binding_question", detail.get("binding_question"));
            map.put("clause_trigger", detail.get("clause_trigger"));
            map.put("is_clause", detail.get("is_clause"));
            map.put("is_default", detail.get("is_default"));
            map.put("glossary_guide", detail.get("glossary_guide"));
            return map;
        }).collect(Collectors.toList());
    }

    /**
     * questionData를 필요한 필드만 남긴 Map 리스트로 변환
     */
    private List<Map<String, Object>> preprocessQuestionArray(
            List<Map<String, Object>> questionData) {
        return questionData.stream().map(detail -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", detail.get("id"));
            map.put("midx", detail.get("midx"));
            map.put("qidx", detail.get("qidx"));
            map.put("binding_question_ko", detail.get("binding_question_ko"));
            map.put("binding_parent", detail.get("binding_parent"));
            map.put("question_category", detail.get("question_category"));
            map.put("question_title_tag", detail.get("question_title_tag"));
            map.put("question_tip", detail.get("question_tip"));
            map.put("question_guide", detail.get("question_guide"));
            map.put("is_default", detail.get("is_default"));
            map.put("is_fixed", detail.get("is_fixed"));
            map.put("question_title_ko", detail.get("question_title_ko"));
            map.put("binding_key", detail.get("binding_key"));
            map.put("output_type", detail.get("output_type"));
            map.put("question_type", detail.get("question_type"));
            map.put("placeholder", detail.get("placeholder"));
            map.put("options", detail.get("options"));
            map.put("binding_cidx", detail.get("binding_cidx"));
            map.put("binding_trigger", detail.get("binding_trigger"));
            return map;
        }).collect(Collectors.toList());
    }

    /**
     * clause의 clause_trigger 추출
     */
    private List<List<String>> extractClauseTriggers(List<Map<String, Object>> clauseArray) {
        return clauseArray.stream().map(clause -> extractWords((String) clause.get("content_en")))
                .collect(Collectors.toList());
    }


    /**
     * binding_input 생성
     */
    private List<List<Map<String, Object>>> generateBindingInput(List<List<String>> keyObj) {
        return keyObj.stream().map(keys -> keys.stream().map(key -> {
            Map<String, Object> map = new HashMap<>();
            map.put("key", key);
            map.put("value", "");
            map.put("placeholder", "");
            return map;
        }).collect(Collectors.toList())).collect(Collectors.toList());
    }


    /**
     * clause_trigger 및 binding_input을 clauseArray에 추가하고 cno 설정
     */
    private void addClauseTriggerAndBindingInput(List<Map<String, Object>> clauseArray,
            List<List<String>> keyObj, List<List<Map<String, Object>>> valueObj) {
        int clauseNum = 1;
        for (int i = 0; i < clauseArray.size(); i++) {
            Map<String, Object> clause = clauseArray.get(i);
            clause.put("clause_trigger", keyObj.get(i));
            clause.put("binding_input", valueObj.get(i));
            if (Boolean.TRUE.equals(clause.get("is_clause"))
                    && Boolean.TRUE.equals(clause.get("is_default"))) {
                clause.put("cno", clauseNum++);
            }
        }
    }

    /**
     * input_array 생성 (binding_key에 해당하는 question_title_tag 값을 placeholder로 설정)
     */
    private List<Map<String, Object>> generateInputArray(List<List<String>> keyObj,
            List<Map<String, Object>> questionArray) {

        // keyObj를 하나의 Set으로 펼쳐서 유니크한 key 값만 추출
        Set<String> uniqueKeys = keyObj.stream().flatMap(List::stream).collect(Collectors.toSet());

        // questionArray에서 binding_key와 question_title_tag를 매핑 (빠른 조회를 위해 Map 활용)
        Map<String, String> keyToPlaceholderMap = questionArray.stream()
                .filter(q -> q.get("binding_key") != null && q.get("question_title_tag") != null)
                .collect(Collectors.toMap(q -> (String) q.get("binding_key"),
                        q -> (String) q.get("question_title_tag"),
                        (existing, replacement) -> existing // 중복 key 발생 시 기존 값 유지
                ));

        // input_array 리스트 생성
        List<Map<String, Object>> inputArray = new ArrayList<>();

        for (String key : uniqueKeys) {
            Map<String, Object> inputMap = new HashMap<>();
            inputMap.put("key", key);
            inputMap.put("value", "");
            inputMap.put("binding_cidx", new ArrayList<Integer>()); // 중복 방지 & 최적화
            inputMap.put("placeholder", keyToPlaceholderMap.getOrDefault(key, "")); // 빠른 조회

            inputArray.add(inputMap);
        }

        return inputArray;
    }


    /**
     * binding_cidx 및 placeholder 값 업데이트
     */
    private void updateBindingCidxAndPlaceholders(List<Map<String, Object>> clauseArray,
            List<Map<String, Object>> questionArray, List<Map<String, Object>> inputArray) {

        for (Map<String, Object> clause : clauseArray) {
            List<String> clauseTriggers = (List<String>) clause.get("clause_trigger");

            for (Map<String, Object> question : questionArray) {
                String bindingKey = (String) question.get("binding_key");

                // ✅ clause의 clause_trigger 안에 question의 binding_key가 포함된 경우
                if (clauseTriggers.contains(bindingKey)) {
                    // ✅ question의 binding_cidx에 clause의 cidx 추가 (Set으로 중복 방지)
                    Set<Integer> bindingSet =
                            new HashSet<>((List<Integer>) question.get("binding_cidx"));
                    bindingSet.add((Integer) clause.get("cidx"));
                    question.put("binding_cidx", new ArrayList<>(bindingSet));

                    // ✅ clause의 binding_input에서 question의 binding_key를 찾아 placeholder 업데이트
                    List<Map<String, Object>> bindingInput =
                            (List<Map<String, Object>>) clause.get("binding_input");
                    for (Map<String, Object> input : bindingInput) {
                        if (input.get("key").equals(bindingKey)) {
                            input.put("placeholder", question.get("question_title_tag")); // placeholder
                                                                                          // 업데이트
                        }
                    }

                    // ✅ input_array에서도 binding_cidx 업데이트 (중복 방지)
                    inputArray.stream().filter(input -> input.get("key").equals(bindingKey))
                            .forEach(input -> {
                                Set<Integer> inputBindingSet =
                                        new HashSet<>((List<Integer>) input.get("binding_cidx"));
                                inputBindingSet.add((Integer) clause.get("cidx"));
                                input.put("binding_cidx", new ArrayList<>(inputBindingSet));
                            });
                }
            }
        }
    }


    /**
     * clause_array 내 content_en의 `{key}`를 <span> 태그로 변환
     */
    private void updateContentWithPlaceholders(List<Map<String, Object>> clauseArray,
            List<Map<String, Object>> inputArray) {

        for (Map<String, Object> clause : clauseArray) {
            String content = (String) clause.get("content_en");

            for (Map<String, Object> input : inputArray) {
                String key = (String) input.get("key");
                String placeholder = (String) input.get("placeholder");

                // `{key}`를 <span> 태그로 변환
                if (key.contains("etc")) {
                    content = content.replaceAll("\\{" + key + "\\}", "<span id=\"span_" + key
                            + "\" class=\"draft hidden\">[" + key + "]</span>");
                } else {
                    content = content.replaceAll("\\{" + key + "\\}", "<span id=\"span_" + key
                            + "\" class=\"draft\">[" + placeholder + "]</span>");
                }
            }

            // 불필요한 HTML 태그 정리
            content = content.replaceAll("<p class=\"font_8\">", "<p>");
            content = content.replaceAll("<b>", "").replaceAll("</b>", "");

            clause.put("content_en", content);
        }
    }

    /**
     * question을 binding_question_ko 기준으로 그룹화 HashMap은 입력 순서를 보장하지 않음. 순서를 보장하는 LinkedHashMap 사용
     */

    private Map<String, List<Map<String, Object>>> groupQuestionsByBindingKey(
            List<Map<String, Object>> questionArray) {
        return questionArray.stream()
                .collect(Collectors.groupingBy(q -> (String) q.get("binding_question_ko"), // 그룹 키
                        LinkedHashMap::new, // 순서 유지
                        Collectors.toList()));
    }
    // private Map<String, List<Map<String, Object>>> groupQuestionsByBindingKey(
    // List<Map<String, Object>> questionArray) {
    // return questionArray.stream()
    // .collect(Collectors.groupingBy(q -> (String) q.get("binding_question_ko")));
    // }

    /**
     * clauseGuide 리스트 생성 (clause_guide가 존재하는 경우만 추가)
     */
    private List<Map<String, Object>> generateClauseGuide(List<Map<String, Object>> clauseArray) {
        List<Map<String, Object>> clauseGuide = new ArrayList<>();

        for (Map<String, Object> clause : clauseArray) {
            // clause_guide가 null 또는 빈 문자열("")이면 추가하지 않음
            if (clause.get("clause_guide") != null
                    && !((String) clause.get("clause_guide")).isEmpty()) {
                Map<String, Object> clauseGuideObj = new HashMap<>();
                clauseGuideObj.put("id", "tool_" + clause.get("id"));
                clauseGuideObj.put("value", clause.get("clause_guide"));
                clauseGuide.add(clauseGuideObj);
            }
        }

        return clauseGuide;
    }

    /**
     * 문자열에서 `{}`로 감싸진 키 추출
     */
    private List<String> extractWords(String str) {
        List<String> words = new ArrayList<>();

        for (int i = 0; i < str.length(); i++) {
            if (str.charAt(i) == '{') {
                int stopIndex = str.indexOf('}', i);
                if (stopIndex != -1) {
                    words.add(str.substring(i + 1, stopIndex));
                }
            }
        }

        return words.stream().distinct().sorted().collect(Collectors.toList()); // 중복 제거 & 정렬
    }


}
