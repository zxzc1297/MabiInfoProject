package com.example.mabiInfo.service;

import java.util.List;
import java.util.Map;

public interface PartyMakerServiceImpl {
    List<List<Map<String, Object>>> makeAbyssRaidParty(Map<String,List<Map<String,Object>>> characters, int minCombatPower);
    List<List<Map<String, Object>>> makeGlassGivneRaidParty(Map<String, List<Map<String, Object>>> charactersByOwner,
                                                            int healerCountPerParty, // 파티당 목표 힐러 수 추가
                                                            int minCombatPower);
}
