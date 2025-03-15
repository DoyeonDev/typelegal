// repository/: JPA 리포지토리 인터페이스들이 위치하는 디렉토리. ClauseTemplateRepository.java는 CRUD 작업을 처리하는 역할.

package com.typelegal.repository;

import com.typelegal.model.ClauseTemplate;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

// import java.util.UUID;
import java.util.List;

@Repository
public interface ClauseTemplateRepository extends JpaRepository<ClauseTemplate, String> {

        // @Query("SELECT * FROM ClauseTemplate")
        List<ClauseTemplate> findAll(); // 모든 데이터 가져오기

        List<ClauseTemplate> findByCid(String cid); // 'CId' → 'cid'로 변경 Spring Data JPA는 필드명을 정확히
                                                    // 일치

        @Query(value = "SELECT * FROM clause_template", nativeQuery = true)
        List<ClauseTemplate> searchByCid(@Param("part1") String part1,
                        @Param("part2") String part2);


        @Query("SELECT c FROM ClauseTemplate c " + "WHERE c.cid = :query1 "
                        + "OR (c.cid LIKE CONCAT(:query1, '_%') AND c.cid LIKE CONCAT('%_', :query2)) "
                        + "ORDER BY c.cidx ASC")
        List<ClauseTemplate> findByCustomConditions(@Param("query1") String query1,
                        @Param("query2") String query2);


}
