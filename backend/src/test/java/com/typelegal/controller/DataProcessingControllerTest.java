package test.java.com.typelegal.controller;

import com.typelegal.service.DataProcessingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DataProcessingController.class)
class DataProcessingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DataProcessingService dataProcessingService;

    @Test
    void testProcessData() throws Exception {
        // Mock 데이터 생성
        Map<String, Object> mockResponse = new HashMap<>();
        mockResponse.put("message", "Processing successful");

        when(dataProcessingService.processData(any(), any())).thenReturn(mockResponse);

        // GET 요청 테스트
        mockMvc.perform(get("/api/data/process")).andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Processing successful"));
    }
}
