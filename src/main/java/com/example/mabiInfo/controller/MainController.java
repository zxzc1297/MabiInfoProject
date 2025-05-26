package com.example.mabiInfo.controller;

import com.example.mabiInfo.model.Notice;
import com.example.mabiInfo.service.CrawlerService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.util.List;
import java.util.Map;


@Controller
@Slf4j
@RequiredArgsConstructor
public class MainController {

    private final CrawlerService crawlerService;

    @GetMapping("/")
    public String goMain(Model model, HttpServletRequest request){
        return "index";
    }

    @GetMapping("/runes")
    public String goRuneList(Model model, HttpServletRequest request){
        return "runes";
    }

    @GetMapping("/materials")
    public String goMaterialList(Model model, HttpServletRequest request){
        return "materials";
    }

    @PostMapping("/ranking")
    @ResponseBody
    public List<Notice> getRanking(Model model, HttpServletRequest request) throws IOException {
        return crawlerService.getNewsList();
    }
}
