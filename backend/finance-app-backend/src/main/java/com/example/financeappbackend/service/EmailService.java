package com.example.financeappbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender emailSender;

    public void sendSimpleMessage(String to, String subject, String text) {
        logger.info("Attempting to send email to: {}", to);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("personalfinancemanagerr@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        try {
            emailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email to: {}. Error: {}", to, e.getMessage());
            e.printStackTrace();
        }
    }
}