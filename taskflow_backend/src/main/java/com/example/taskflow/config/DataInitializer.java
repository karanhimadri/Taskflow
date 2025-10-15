package com.example.taskflow.config;

import com.example.taskflow.entity.User;
import com.example.taskflow.enums.RoleType;
import com.example.taskflow.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    public CommandLineRunner initializeData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if any users exist
            if (userRepository.count() == 0) {
                logger.info("No users found in database. Creating initial admin user...");

                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@taskflow.com");
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setRole(RoleType.ADMIN);
                admin.setStatus(true);

                userRepository.save(admin);

                logger.info("=".repeat(60));
                logger.info("Initial admin user created successfully!");
                logger.info("Email: admin@taskflow.com");
                logger.info("Password: Admin@123");
                logger.info("⚠️  IMPORTANT: Change this password immediately!");
                logger.info("=".repeat(60));
            } else {
                logger.info("Users already exist in database. Skipping initialization.");
            }
        };
    }
}
