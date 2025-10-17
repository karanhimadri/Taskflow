package com.example.taskflow.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    @Autowired private JavaMailSender mailSender;
    @Autowired TemplateEngine templateEngine;

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("himadri7585@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public void sendWelcomeEmail(String to, String subject, String name) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // Set Sender
        helper.setFrom("Taskflow <himadri7585@gmail.com>");
        helper.setTo(to);
        helper.setSubject(subject);

        // Prepare the HTML content using Thymeleaf
        Context context = new Context();
        context.setVariable("name", name);
        String htmlContent = templateEngine.process("email-template", context);

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }

}
