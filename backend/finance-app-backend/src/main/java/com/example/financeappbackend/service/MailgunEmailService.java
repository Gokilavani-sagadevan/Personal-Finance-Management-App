package com.example.financeappbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class MailgunEmailService {

    private static final Logger logger = LoggerFactory.getLogger(MailgunEmailService.class);

    @Autowired
    private JavaMailSender emailSender;

    @Value("${mailgun.from.email}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String text) {
        logger.info("Preparing to send email. From: {}, To: {}, Subject: {}", fromEmail, to, subject);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            logger.info("Sending email message: {}", message);
            emailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email to: {}. Error: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send email", e);
        }
    }
}