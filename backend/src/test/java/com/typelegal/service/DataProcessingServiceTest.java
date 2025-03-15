package test.java.com.typelegal.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class DataProcessingServiceTest {

    @InjectMocks
    private DataProcessingService dataProcessingService;

    private List<Map<String, Object>> clauseData;
    private List<Map<String, Object>> questionData;

    @BeforeEach
    void setUp() {
        clauseData = new ArrayList<>();
        questionData = new ArrayList<>();

        // 샘플 clause 데이터 추가
        Map<String, Object> clause = new HashMap<>();
        clause.put("id", "1");
        clause.put("cidx", 1);
        clause.put("cno", 100);
        clause.put("clause_title_en", "Sample Clause");
        clause.put("content_en", "This is a {key1} test clause.");
        clause.put("is_clause", true);
        clause.put("is_default", true);
        clauseData.add(clause);

        // 샘플 question 데이터 추가
        Map<String, Object> question = new HashMap<>();
        question.put("id", "Q1");
        question.put("binding_key", "key1");
        question.put("question_title_tag", "Placeholder Question");
        questionData.add(question);
    }

    @Test
    void testProcessData() {
        Map<String, Object> result = dataProcessingService.processData(clauseData, questionData);

        assertNotNull(result);
        assertTrue(result.containsKey("clause"));
        assertTrue(result.containsKey("question"));
        assertTrue(result.containsKey("input_array"));

        List<Map<String, Object>> processedClauses =
                (List<Map<String, Object>>) result.get("clause");
        assertEquals(1, processedClauses.size());
        assertEquals("[Placeholder Question]", processedClauses.get(0).get("content_en"));
    }
}
