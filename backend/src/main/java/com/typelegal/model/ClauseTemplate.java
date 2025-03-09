// model/: 데이터베이스의 테이블을 나타내는 JPA 엔티티 클래스들이 위치하는 디렉토리. ClauseTemplate.java는 clause_template 테이블에 매핑되는
// 엔티티 클래스.

package com.typelegal.model;

import jakarta.persistence.*;
import java.util.List;
// import java.util.List;
import java.util.UUID;
// import org.hibernate.annotations.Type;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "clause_template")
public class ClauseTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false) // 여기 DB 컬럼명과 정확히 일치해야 함
    private String id;

    @Column(name = "cid") // DB 컬럼명과 동일한지 확인
    private String cid;

    @Column(name = "cidx")
    private int cidx;

    @Column(name = "clause_title_en")
    private String clause_title_en;

    @Column(name = "clause_guide")
    private String clause_guide;

    @Column(name = "content_en")
    private String content_en;

    @Column(name = "binding_question")
    private String binding_question;

    @Column(name = "binding_input")
    private String binding_input; // JSONB 필드는 String으로 받을 수 있음

    // @Column(columnDefinition = "BYTEA") // PostgreSQL에서 varbinary 대신 BYTEA 사용
    // private byte[] clause_trigger;

    @Column(name = "clause_trigger", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> clause_trigger;

    @Column(name = "is_clause")
    private boolean is_clause;

    @Column(name = "is_default")
    private boolean is_default;

    @Column(name = "clause_category")
    private String clause_category;
    // getters and setters

}
