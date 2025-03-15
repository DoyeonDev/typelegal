package test.java.com.typelegal.repository;

import com.typelegal.model.ClauseTemplate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class ClauseTemplateRepositoryTest {

    @Autowired
    private ClauseTemplateRepository clauseTemplateRepository;

    @Test
    void testFindAll() {
        List<ClauseTemplate> clauses = clauseTemplateRepository.findAll();
        assertNotNull(clauses);
    }
}
