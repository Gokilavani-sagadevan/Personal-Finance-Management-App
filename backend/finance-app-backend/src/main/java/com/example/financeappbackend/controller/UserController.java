package com.example.financeappbackend.controller;

import com.example.financeappbackend.dto.EmailNotificationRequest;
import com.example.financeappbackend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @GetMapping("/settings")
    public ResponseEntity<?> getUserSettings() {
        try {
            return ResponseEntity.ok(userService.getUserSettings());
        } catch (Exception e) {
            logger.error("Failed to get user settings", e);
            return ResponseEntity.badRequest().body("Failed to get user settings: " + e.getMessage());
        }
    }

    @PutMapping("/email-notifications")
    public ResponseEntity<?> updateEmailNotifications(@RequestBody EmailNotificationRequest request) {
        logger.info("Received request to update email notifications: {}", request.isEnabled());
        try {
            userService.updateEmailNotifications(request.isEnabled());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Failed to update email notifications", e);
            return ResponseEntity.badRequest().body("Failed to update email notifications: " + e.getMessage());
        }
    }
}