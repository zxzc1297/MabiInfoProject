package com.example.mabiInfo.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class PartyMakerService implements PartyMakerServiceImpl{

    @Override
    public List<Map<String, Object>> makeAbyssRaidParty(Map<String, List<Map<String, Object>>> characters, int minCombatPower) {
        return List.of();
    }

    @Override
    public List<Map<String, Object>> makeGlassGivneRaidParty(Map<String, List<Map<String, Object>>> characters, int minCombatPower) {
        return List.of();
    }
}
