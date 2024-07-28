package com.example.financeappbackend.controller;

import com.example.financeappbackend.model.Budget;
import com.example.financeappbackend.model.User;
import com.example.financeappbackend.repository.BudgetRepository;
import com.example.financeappbackend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private static final Logger logger = LoggerFactory.getLogger(BudgetController.class);

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        return userRepository.findByEmail(currentUserName);
    }

    @GetMapping
    public ResponseEntity<?> getAllBudgets() {
        try {
            User currentUser = getCurrentUser();
            List<Budget> budgets = budgetRepository.findByUser(currentUser);
            logger.info("Retrieved {} budgets for user {}", budgets.size(), currentUser.getEmail());
            return ResponseEntity.ok(budgets);
        } catch (Exception e) {
            logger.error("Error retrieving budgets", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving budgets");
        }
    }

    @PostMapping
    public ResponseEntity<?> createBudget(@RequestBody Budget budget) {
        try {
            User currentUser = getCurrentUser();
            budget.setUser(currentUser);
            Budget savedBudget = budgetRepository.save(budget);
            logger.info("Created budget with id: {} for user {}", savedBudget.getId(), currentUser.getEmail());
            return ResponseEntity.ok(savedBudget);
        } catch (Exception e) {
            logger.error("Error creating budget", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating budget");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBudget(@PathVariable Long id, @RequestBody Budget budgetDetails) {
        try {
            User currentUser = getCurrentUser();
            Budget budget = budgetRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Budget not found with id " + id));
            
            if (!budget.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to update this budget");
            }

            budget.setCategory(budgetDetails.getCategory());
            budget.setAmount(budgetDetails.getAmount());
            budget.setPeriod(budgetDetails.getPeriod());

            Budget updatedBudget = budgetRepository.save(budget);
            logger.info("Updated budget with id: {} for user {}", updatedBudget.getId(), currentUser.getEmail());
            return ResponseEntity.ok(updatedBudget);
        } catch (Exception e) {
            logger.error("Error updating budget", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating budget");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            Budget budget = budgetRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Budget not found with id " + id));
            
            if (!budget.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to delete this budget");
            }

            budgetRepository.delete(budget);
            logger.info("Deleted budget with id: {} for user {}", id, currentUser.getEmail());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting budget", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting budget");
        }
    }
}