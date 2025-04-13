package com.employee.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, updatable = false, unique = false)
    private String firstName;

    @Column(nullable = false, updatable = false, unique = false)
    private String lastName;

    @Column(nullable = false, unique = true, updatable = false)
    private String email;

    private String phone;

    @Column(nullable = false, updatable = false, unique = false)
    private String position;

    @Column(nullable = false, updatable = false, unique = false)
    private String department;

    @Column(nullable = false, updatable = false, unique = false)
    private BigDecimal salary;

    private LocalDate hireDate;

    @CreatedDate
    @Column(nullable = false, updatable = false, unique = false)
    private LocalDateTime createdAt;

    @LastModifiedDate

    @Column(nullable = false, updatable = false, unique = false)
    private LocalDateTime updatedAt;
}