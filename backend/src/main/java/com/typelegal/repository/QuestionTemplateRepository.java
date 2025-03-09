package com.typelegal.repository;

import com.typelegal.model.QuestionTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

// import org.springframework.data.repository.query.Param;
// import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionTemplateRepository extends JpaRepository<QuestionTemplate, String> {
        // @Query("SELECT * FROM ClauseTemplate")
        List<QuestionTemplate> findAll(); // 모든 데이터 가져오기


        @Query("SELECT q FROM QuestionTemplate q " + "WHERE q.cid = :query1 "
                        + "OR (q.cid LIKE CONCAT(:query1, '_%') AND q.cid LIKE CONCAT('%_', :query2)) "
                        + "ORDER BY q.midx ASC, q.qidx ASC")
        List<QuestionTemplate> findByCustomConditions(@Param("query1") String query1,
                        @Param("query2") String query2);
}
