
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('combat-power-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = {
            // A: 공격력
            characterAttack: parseFloat(document.getElementById('characterAttack').value) || 0,
            weaponAttack: parseFloat(document.getElementById('weaponAttack').value) || 0,
            emblemPercent: parseFloat(document.getElementById('emblemPercent').value) || 0,
            statBonusAttack: parseFloat(document.getElementById('statBonusAttack').value) || 0,
            petAttack: parseFloat(document.getElementById('petAttack').value) || 0,

            // B: 공증
            itemAttackIncreasePercent: parseFloat(document.getElementById('itemAttackIncreasePercent').value) || 0,
            skillAttackIncreasePercent: parseFloat(document.getElementById('skillAttackIncreasePercent').value) || 0,
            solidAttackIncreasePercent: parseFloat(document.getElementById('solidAttackIncreasePercent').value) || 0,

            // C: 피증
            skillPower: parseFloat(document.getElementById('skillPower').value) || 0,
            itemDamageIncreasePercent: parseFloat(document.getElementById('itemDamageIncreasePercent').value) || 0,
            receivedDamageIncreasePercent: parseFloat(document.getElementById('receivedDamageIncreasePercent').value) || 0,
            synergyPercent: parseFloat(document.getElementById('synergyPercent').value) || 0,
            helioPercent: parseFloat(document.getElementById('helioPercent').value) || 0,
            partialSkillDamagePercent: parseFloat(document.getElementById('partialSkillDamagePercent').value) || 0,

            // D: 강화류
            multiHitDamagePercent: parseFloat(document.getElementById('multiHitDamagePercent').value) || 0,
            strongHitDamagePercent: parseFloat(document.getElementById('strongHitDamagePercent').value) || 0,
            multiHitStat: parseFloat(document.getElementById('multiHitStat').value) || 0,
            strongHitStat: parseFloat(document.getElementById('strongHitStat').value) || 0,

            // E: 보석
            gemTagDamagePercent: parseFloat(document.getElementById('gemTagDamagePercent').value) || 0,

            // F: 치명타
            criticalHitStat: parseFloat(document.getElementById('criticalHitStat').value) || 0,
            bossResistancePercent: parseFloat(document.getElementById('bossResistancePercent').value) || 0,
            torchPercent: parseFloat(document.getElementById('torchPercent').value) || 0,
            brilliantPercent: parseFloat(document.getElementById('brilliantPercent').value) || 0,
            charCritIncreasePercent: parseFloat(document.getElementById('charCritIncreasePercent').value) || 0,
            brilliantRatePercent: parseFloat(document.getElementById('brilliantRatePercent').value) || 0,
            charCritDamagePercent: parseFloat(document.getElementById('charCritDamagePercent').value) || 0
        };

        fetch('/api/combat-power/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            const resultContainer = document.getElementById('result-container');
            const resultSpan = document.getElementById('combat-power-result');
            resultSpan.textContent = data.combatPower.toLocaleString('ko-KR', { maximumFractionDigits: 0 });
            resultContainer.style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('계산 중 오류가 발생했습니다.');
        });
    });
});
