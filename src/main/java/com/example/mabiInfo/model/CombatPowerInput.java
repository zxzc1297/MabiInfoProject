
package com.example.mabiInfo.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CombatPowerInput {

    // A: 공격력
    private double characterAttack;     // 캐릭터 공격력
    private double weaponAttack;        // 무기 공격력
    private double emblemPercent;       // 엠블럼 (%)
    private double statBonusAttack;     // 스탯 보너스 공격력
    private double petAttack;           // 펫 공격력

    // B: 공증
    private double itemAttackIncreasePercent;   // 템 공증 (%)
    private double skillAttackIncreasePercent;  // 스킬 공증 (%)
    private double solidAttackIncreasePercent;  // 굳건 공증 (%)

    // C: 피증
    private double skillPower;                  // 스킬 위력
    private double itemDamageIncreasePercent;   // 템 주피증 (%)
    private double receivedDamageIncreasePercent; // 템 받피증 (%)
    private double synergyPercent;              // 시너지 (%)
    private double helioPercent;                // 헬리오 (%)
    private double partialSkillDamagePercent;   // 일부 스킬 댐증 (%)

    // D: 강화류
    private double multiHitDamagePercent;       // 연타 댐증 (%)
    private double strongHitDamagePercent;      // 강타 댐증 (%)
    private double multiHitStat;                // 연타 스탯 (연타 강화)
    private double strongHitStat;               // 강타 스탯 (강타 강화)

    // E: 보석
    private double gemTagDamagePercent;         // 보석 태그 댐증 (%)

    // F: 치명타
    private double criticalHitStat;             // 치명타 스탯
    private double bossResistancePercent;       // 보스 저항 (%)
    private double torchPercent;                // 횃불 (%)
    private double brilliantPercent;            // 현란 (%)
    private double charCritIncreasePercent;     // 캐릭 크확증 (%)
    private double brilliantRatePercent;        // 현란 배율 (%)
    private double charCritDamagePercent;       // 캐릭 크댐증 (%)
}
