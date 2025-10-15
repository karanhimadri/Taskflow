package com.example.taskflow.config;

import com.example.taskflow.utils.JwtAuth;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtAuth jwtAuth;

    public JwtAuthFilter(JwtAuth jwtAuth) {
        this.jwtAuth = jwtAuth;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = null;

        if(request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if("token".equalsIgnoreCase(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if(token == null) {
            String authHeader = request.getHeader("Authorization");
            if(authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }

        if(token != null && jwtAuth.isTokenValid(token)) {
            Long userId = jwtAuth.getUserIdFromToken(token);
            String role = jwtAuth.getRoleFromToken(token);

            if(SecurityContextHolder.getContext().getAuthentication() == null) {
                UsernamePasswordAuthenticationToken authUser = new UsernamePasswordAuthenticationToken(
                        String.valueOf(userId),
                        null,
                        Collections.singleton(() -> "ROLE_" + role)
                );

                authUser.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authUser);
            }
        } else {
            if (token == null)
                logger.warn("No token found in request");
            else
                logger.warn("Invalid JWT token");
        }

        filterChain.doFilter(request, response);
    }
}
