package com.example.mabiInfo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartyGenerationRequest {
    private List<CharacterInfoInput> characters;
    private int raidType;
    private int healerCount;
    private int minCombatPower;
}
