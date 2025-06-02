package com.example.mabiInfo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuthController {

    @GetMapping("/login")
    public String loginPage(Model model) {
        model.addAttribute("currentPage", "login");
        return "login";
    }
    
    // 로그인 성공 후 리다이렉트될 페이지
    @GetMapping("/login/success")
    public String loginSuccess() {
        return "redirect:/";
    }
    
    // 로그인 실패 후 리다이렉트될 페이지
    @GetMapping("/login/error")
    public String loginError(Model model) {
        model.addAttribute("currentPage", "login");
        model.addAttribute("error", "로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
        return "login";
    }
}
