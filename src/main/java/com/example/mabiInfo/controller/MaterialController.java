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
@RequestMapping("/materials")
public class MaterialController {

    /**
     * 제작 재료 리스트 페이지
     * @author lhs
     * @param model
     * @param request
     * @return
     */
    @GetMapping("")
    public String goMaterialList(Model model, HttpServletRequest request){
        model.addAttribute("currentPage", "materials");
        return "materials";
    }
}
