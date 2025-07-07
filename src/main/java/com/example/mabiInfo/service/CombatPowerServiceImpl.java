
package com.example.mabiInfo.service;

import com.example.mabiInfo.model.CombatPowerInput;
import org.springframework.stereotype.Service;

@Service
public class CombatPowerServiceImpl implements CombatPowerService {

    @Override
    public double calculateCombatPower(CombatPowerInput input) {
        // A: 공격력
        double a = input.getCharacterAttack()
                + (input.getWeaponAttack()) * (1 + input.getEmblemPercent() / 100.0)
                + input.getStatBonusAttack()
                + input.getPetAttack();

        // B: 공증
        double b = 1
                + input.getItemAttackIncreasePercent() / 100.0
                + input.getSkillAttackIncreasePercent() / 100.0
                + input.getSolidAttackIncreasePercent() / 100.0;

        // C: 피증
        double c = 1
                + input.getSkillPower() / 8500.0
                + input.getItemDamageIncreasePercent() / 100.0
                + input.getReceivedDamageIncreasePercent() / 100.0
                + input.getSynergyPercent() / 100.0
                + input.getHelioPercent() / 100.0
                + input.getPartialSkillDamagePercent() / 100.0;

        // D: 강화류 (연타/강타)
        double d = (1 + input.getMultiHitDamagePercent() / 100.0 + input.getStrongHitDamagePercent() / 100.0)
                + (input.getMultiHitStat() / 8500.0) * (1 + input.getMultiHitDamagePercent() / 100.0)
                + (input.getStrongHitStat() / 8500.0) * (1 + input.getStrongHitDamagePercent() / 100.0);

        // E: 보석
        double e = 1 + input.getGemTagDamagePercent() / 100.0;

        // F: 치명타
        double criticalHitRate = Math.min(
                Math.max(0.08 * Math.pow(150 + input.getCriticalHitStat(), 0.25) - input.getBossResistancePercent() / 100.0, 0)
                + input.getTorchPercent() / 100.0
                + input.getBrilliantPercent() / 100.0
                + input.getCharCritIncreasePercent() / 100.0,
                1.0 // 100%
        );

        double criticalHitDamageMultiplier = (1.4 + 0.0002 * input.getCriticalHitStat())
                * (1 + input.getBrilliantRatePercent() / 100.0 + input.getCharCritDamagePercent() / 100.0);

        double f = 1 + criticalHitRate * (criticalHitDamageMultiplier - 1);

        // 최종 환산 전투력 (G, H 제외)
        // 이미지의 1.99 계수는 최종 대미지 계산에 사용되므로, 여기서는 각 요소의 곱으로 전투력을 표현합니다.
        return a * b * c * d * e * f;
    }
}
