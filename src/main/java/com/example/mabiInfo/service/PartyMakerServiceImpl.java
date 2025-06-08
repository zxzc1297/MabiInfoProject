package com.example.mabiInfo.service;

import java.util.List;
import java.util.Map;

public interface PartyMakerServiceImpl {
    List<Map<String,Object>> makeAbyssRaidParty(Map<String,List<Map<String,Object>>> characters, int minCombatPower);
    List<Map<String,Object>> makeGlassGivneRaidParty(Map<String,List<Map<String,Object>>> characters, int minCombatPower);
}
