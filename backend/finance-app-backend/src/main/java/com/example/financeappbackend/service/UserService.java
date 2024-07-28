package com.example.financeappbackend.service;

import com.example.financeappbackend.model.User;
import com.example.financeappbackend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MailgunEmailService emailService;

    public Map<String, Object> getUserSettings() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("Fetching settings for user: {}", email);
        User currentUser = userRepository.findByEmail(email);
        if (currentUser == null) {
            logger.error("User not found: {}", email);
            throw new RuntimeException("User not found");
        }
        Map<String, Object> settings = new HashMap<>();
        settings.put("emailNotificationsEnabled", currentUser.isEmailNotificationsEnabled());
        return settings;
    }

    public void updateEmailNotifications(boolean enabled) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("Updating email notifications for user: {} to {}", email, enabled);
        User currentUser = userRepository.findByEmail(email);
        if (currentUser == null) {
            logger.error("User not found: {}", email);
            throw new RuntimeException("User not found");
        }
        currentUser.setEmailNotificationsEnabled(enabled);
        userRepository.save(currentUser);
        logger.info("Email notifications updated successfully for user: {}", email);

        String subject = "Email Notifications Update";
        String message = "Your email notifications have been " + (enabled ? "enabled" : "disabled") + ".";
        try {
            emailService.sendEmail(email, subject, message);
            logger.info("Email notification sent successfully to: {}", email);
        } catch (Exception e) {
            logger.error("Failed to send email notification to: {}. Error: {}", email, e.getMessage());
        }
    }
}