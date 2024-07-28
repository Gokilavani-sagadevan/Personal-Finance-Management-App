package com.example.financeappbackend.service;

import com.example.financeappbackend.model.Transaction;
import com.example.financeappbackend.model.User;
import com.example.financeappbackend.repository.TransactionRepository;
import com.example.financeappbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {

    private static final Logger logger = LoggerFactory.getLogger(TransactionService.class);

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MailgunEmailService emailService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email);
    }

    public List<Transaction> getAllTransactions(LocalDate startDate, LocalDate endDate) {
        User currentUser = getCurrentUser();
        if (startDate != null && endDate != null) {
            return transactionRepository.findByUserAndDateBetween(currentUser, startDate, endDate);
        } else {
            return transactionRepository.findByUser(currentUser);
        }
    }

    public Transaction createTransaction(Transaction transaction) {
        User currentUser = getCurrentUser();
        transaction.setUser(currentUser);
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        if (currentUser.isEmailNotificationsEnabled()) {
            try {
                String subject = "New Transaction Created";
                String content = "A new transaction of " + transaction.getAmount() + " has been created in your account.";
                emailService.sendEmail(currentUser.getEmail(), subject, content);
                logger.info("Email notification sent for new transaction to user: {}", currentUser.getEmail());
            } catch (Exception e) {
                logger.error("Failed to send email notification for new transaction", e);
            }
        }
        
        return savedTransaction;
    }

    public Transaction updateTransaction(Long id, Transaction transactionDetails) {
        User currentUser = getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id " + id));
        
        if (!transaction.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to update this transaction");
        }

        transaction.setAmount(transactionDetails.getAmount());
        transaction.setCategory(transactionDetails.getCategory());
        transaction.setDate(transactionDetails.getDate());
        transaction.setType(transactionDetails.getType());

        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        User currentUser = getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id " + id));
        
        if (!transaction.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to delete this transaction");
        }

        transactionRepository.delete(transaction);
    }
}