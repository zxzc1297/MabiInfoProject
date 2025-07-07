
package com.example.mabiInfo.controller;

import com.example.mabiInfo.model.CombatPowerInput;
import com.example.mabiInfo.service.CombatPowerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Collections;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class CombatPowerController {

    private final CombatPowerService combatPowerService;

    @GetMapping("/combat-power-analyzer")
    public String combatPowerAnalyzerPage() {
        return "combatPowerAnalyzer";
    }

    @PostMapping("/api/combat-power/calculate")
    @ResponseBody
    public Map<String, Double> calculateCombatPower(@RequestBody CombatPowerInput input) {
        double result = combatPowerService.calculateCombatPower(input);
        return Collections.singletonMap("combatPower", result);
    }
}
