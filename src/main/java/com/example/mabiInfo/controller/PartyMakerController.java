package com.example.mabiInfo.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/partyMaker")
public class PartyMakerController {

    @GetMapping("")
    public String goPartyMaker(Model model){
        model.addAttribute("currentPage", "partyMaker");
        return "partyMaker";
    }
}
