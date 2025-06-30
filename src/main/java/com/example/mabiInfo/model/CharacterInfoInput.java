package com.example.mabiInfo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CharacterInfoInput {
    private String name;
    private int power;
    private String job;
    private String role;
    private String type;
    private String owner;
    private int ownerIndex;
}
