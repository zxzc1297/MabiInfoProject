//package com.example.mabiInfo.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//            .authorizeHttpRequests(authorize -> authorize
//                .requestMatchers("/", "/css/**", "/js/**", "/images/**", "/login", "/error").permitAll()
//                .requestMatchers("/materials", "/runes", "/skills", "/hunting", "/exchange", "/quests").permitAll()
//                .requestMatchers("/character/**").authenticated()
//                .anyRequest().authenticated()
//            )
//            .oauth2Login(oauth2 -> oauth2
//                .loginPage("/login")
//                .defaultSuccessUrl("/login/success", true)
//                .failureUrl("/login/error")
//            )
//            .logout(logout -> logout
//                .logoutSuccessUrl("/")
//                .permitAll()
//            );
//
//        return http.build();
//    }
//}
