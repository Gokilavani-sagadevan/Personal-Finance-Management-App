package com.example.financeappbackend.model;

import javax.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "email_notifications_enabled")
    private boolean emailNotificationsEnabled = false;

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                '}';
    }

    // Remove this method as it's not needed
    // public User orElseThrow(Object object) {
    //     throw new UnsupportedOperationException("Unimplemented method 'orElseThrow'");
    // }
}
