package com.typelegal.model;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import lombok.NoArgsConstructor;

import org.hibernate.annotations.Type;
// import org.hibernate.annotations.TypeDef;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
// @TypeDef(name = "jsonb", typeClass = JsonBinaryType.class) // Jsonb 타입으로 저장
@Table(name = "question_template")
public class QuestionTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false) // 여기 DB 컬럼명과 정확히 일치해야 함
    private String id;

    @Column(name = "cid") // DB 컬럼명과 동일한지 확인
    private String cid;

    @Column(name = "binding_key")
    private String binding_key;

    @Column(name = "question_type")
    private String question_type;

    @Column(name = "placeholder")
    private String placeholder;

    // @Column(name = "options", columnDefinition = "jsonb")
    // @JdbcTypeCode(SqlTypes.JSON)
    // private List<Option> options;

    // @Column(name = "options", columnDefinition = "jsonb")
    // private String options; // JSONB 타입을 String으로 저장

    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private List<Map<String, Object>> options;

    @Column(name = "output_type")
    private String output_type;

    @Column(name = "binding_parent")
    private String binding_parent;

    @Column(name = "is_default")
    private boolean is_default;

    @Column(name = "is_fixed")
    private boolean is_fixed;

    @Column(name = "question_guide")
    private String question_guide;

    @Column(name = "midx")
    private int midx;

    @Column(name = "qidx")
    private int qidx;

    @Column(name = "binding_cidx", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private List<Integer> binding_cidx;

    @Column(name = "binding_trigger", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> binding_trigger;

    // @Column(name = "binding_cidx", columnDefinition = "integer[]")
    // @JdbcTypeCode(SqlTypes.ARRAY)
    // private List<Integer> binding_cidx;

    // @Column(name = "binding_cidx", columnDefinition = "jsonb")
    // private String binding_cidx; // JSONB 타입을 String으로 저장

    // @Column(name = "binding_cidx", columnDefinition = "BYTEA") // PostgreSQL에서 varbinary 대신 BYTEA
    // 사용
    // private byte[] binding_cidx;

    // @Column(name = "binding_cidx", columnDefinition = "jsonb") // PostgreSQL에서 varbinary 대신 BYTEA
    // 사용
    // @Type(JsonBinaryType.class)
    // JsonBinaryType binding_cidx;

    @Column(name = "title")
    private String title;

    @Column(name = "question_category")
    private String question_category;

    @Column(name = "question_title_ko")
    private String question_title_ko;

    @Column(name = "binding_question_ko")
    private String binding_question_ko;

    @Column(name = "question_title_tag")
    private String question_title_tag;

    @Column(name = "question_tip")
    private String question_tip;
}
