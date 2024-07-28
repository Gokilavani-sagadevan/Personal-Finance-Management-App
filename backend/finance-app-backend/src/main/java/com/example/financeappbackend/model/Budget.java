package com.example.financeappbackend.model;

import lombok.Data;
import javax.persistence.*;
import java.math.BigDecimal;

@Data
@Entity
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private BudgetPeriod period;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum BudgetPeriod {
        MONTHLY, YEARLY
    }
}