package com.example.mabiInfo.controller;

import com.example.mabiInfo.model.CharacterInfoInput;
import com.example.mabiInfo.model.PartyGenerationRequest;
import com.example.mabiInfo.service.PartyMakerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/partyMaker")
public class PartyMakerController {

    private final PartyMakerService partyMakerService;

    @GetMapping("")
    public String goPartyMaker(Model model){
        model.addAttribute("currentPage", "partyMaker");
        return "partyMaker";
    }

    @PostMapping("/api/generate")
    @ResponseBody
    public ResponseEntity<List<List<Map<String, Object>>>> generateParties(@RequestBody PartyGenerationRequest request) {
        List<List<Map<String, Object>>> parties;
        if (request.getRaidType() == 4) {
            parties = partyMakerService.makeAbyssRaidParty(
                    groupCharactersByOwner(request.getCharacters()),
                    request.getMinCombatPower()
            );
        } else {
            parties = partyMakerService.makeGlassGivneRaidParty(
                    groupCharactersByOwner(request.getCharacters()),
                    request.getHealerCount(),
                    request.getMinCombatPower()
            );
        }
        return ResponseEntity.ok(parties);
    }

    private Map<String, List<Map<String, Object>>> groupCharactersByOwner(List<CharacterInfoInput> characters) {
        Map<String, List<Map<String, Object>>> groupedCharacters = new HashMap<>();

        for (CharacterInfoInput character : characters) {
            String owner = character.getOwner();
            List<Map<String, Object>> ownerCharacters = groupedCharacters.computeIfAbsent(owner, k -> new ArrayList<>());

            Map<String, Object> charMap = new HashMap<>();
            charMap.put("name", character.getName());
            charMap.put("power", character.getPower());
            charMap.put("job", character.getJob());
            
            ownerCharacters.add(charMap);
        }

        return groupedCharacters;
    }
}
