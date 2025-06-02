package com.example.mabiInfo.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/runes")
public class RuneController {

    /**
     * 룬 목록 페이지
     * @author lhs
     * @param model
     * @param request
     * @return
     */
    @GetMapping("")
    public String goRuneList(Model model, HttpServletRequest request){
        model.addAttribute("currentPage", "runes");
        //룬 목록 가져오는 서비스 추가
        return "runes";
    }
}
