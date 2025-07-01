package com.example.mabiInfo.controller;

import com.example.mabiInfo.model.News;
import com.example.mabiInfo.service.CrawlerService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;
import java.util.List;


@Controller
@Slf4j
@RequiredArgsConstructor
public class MainController {

    private final CrawlerService crawlerService;

    /**
     * 메인 페이지
     * @author lhs
     * @param model
     * @param request
     * @return 메인 페이지
     * @throws IOException
     */
    @GetMapping("/")
    public String goMain(Model model, HttpServletRequest request) throws IOException{
        List<News> noticeList = crawlerService.getNewsList("notice");
        List<News> devNoteList = crawlerService.getNewsList("devnote");
        List<News> updateList = crawlerService.getNewsList("update");

        model.addAttribute("noticeList", noticeList);
        model.addAttribute("devNoteList", devNoteList);
        model.addAttribute("updateList", updateList);
        model.addAttribute("currentPage", "main");
        return "index";
    }

    /**
     * Skills 페이지
     * @author lhs
     * @param model
     * @return Skills 페이지
     */
    @GetMapping("/skills")
    public String goSkills(Model model) {
        model.addAttribute("currentPage", "skills");
        return "skills";
    }

}
