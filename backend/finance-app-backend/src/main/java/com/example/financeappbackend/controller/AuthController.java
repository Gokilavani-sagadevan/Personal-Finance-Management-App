package com.example.financeappbackend.controller;

import com.example.financeappbackend.model.User;
import com.example.financeappbackend.repository.UserRepository;
import com.example.financeappbackend.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        logger.debug("Registering user: {}", user.getEmail());
        if (userRepository.existsByEmail(user.getEmail())) {
            logger.debug("Email already in use: {}", user.getEmail());
            return ResponseEntity.badRequest().body("Email is already in use");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        logger.debug("User registered successfully: {}", savedUser.getEmail());
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        logger.debug("Login attempt for user: {}", email);

        User user = userRepository.findByEmail(email);
        if (user == null) {
            logger.debug("User not found: {}", email);
            return ResponseEntity.badRequest().body("Invalid email or password");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            logger.debug("Invalid password for user: {}", email);
            return ResponseEntity.badRequest().body("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        logger.debug("Login successful for user: {}", email);
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        return ResponseEntity.ok(response);
    }
}