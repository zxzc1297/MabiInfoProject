package com.example.mabiInfo.service;

import com.example.mabiInfo.model.CharacterInfo;
import com.example.mabiInfo.model.PartyShell;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import static com.example.mabiInfo.config.SystemStatic.CLASS_DATA;

@Service
@Slf4j
public class PartyMakerService implements PartyMakerServiceImpl{

    @Override
    public List<List<Map<String, Object>>> makeAbyssRaidParty(Map<String, List<Map<String, Object>>> charactersByOwner, int minCombatPower) {
        // 1. 입력 데이터 변환: Map -> List<CharacterInfo>
        List<CharacterInfo> allCharacters = new ArrayList<>();
        Map<String, Integer> ownerNameToIndexMap = new HashMap<>();
        int ownerIdxCounter = 0;

        for (Map.Entry<String, List<Map<String, Object>>> entry : charactersByOwner.entrySet()) {
            String ownerId = entry.getKey();
            if (!ownerNameToIndexMap.containsKey(ownerId)) {
                ownerNameToIndexMap.put(ownerId, ownerIdxCounter++);
            }
            int currentOwnerIndex = ownerNameToIndexMap.get(ownerId);

            for (Map<String, Object> charMap : entry.getValue()) {
                // Map에서 직접 값을 추출할 때 타입 캐스팅 및 null 체크 주의
                String name = (String) charMap.get("name");
                // API 스펙에 따라 Integer or Long. JS는 number로 퉁치지만 Java는 명확해야 함.
                int power = ((Number) charMap.get("power")).intValue();
                String job = (String) charMap.get("job");
                if (name != null && job != null) { // 필수 값 체크
                    allCharacters.add(new CharacterInfo(name, power, job, ownerId, currentOwnerIndex, CLASS_DATA));
                }
            }
        }

        // JavaScript의 generate4ManParties_balanced 로직을 여기에 Java로 구현
        // (0) 최소 전투력 필터링
        List<CharacterInfo> charactersForPartyBuilding = allCharacters.stream()
                .filter(c -> c.getPower() >= minCombatPower)
                .collect(Collectors.toList());

        List<PartyShell> partyShells = new ArrayList<>();
        Set<String> usedCharacterNames = new HashSet<>(); // 사용된 캐릭터 이름 추적 (CharacterInfo.getName())

        // (1) 파티 '틀' 생성
        int numPartiesToCreate = 0;
        if (!allCharacters.isEmpty()) { // 원본 캐릭터 기준으로 파티 수 결정
            numPartiesToCreate = (int) Math.ceil((double) allCharacters.size() / 4.0);
        } else { // 입력된 캐릭터가 아예 없는 경우
            // 서비스 정책에 따라 빈 리스트를 반환하거나, 빈 파티 1개를 만들 수 있음
            // 여기서는 JS처럼 빈 파티 1개 만들도록 가정 (displayParties에서 처리)
            // 하지만 실제 캐릭터가 없으면 채울 수 없으므로, charactersForPartyBuilding이 비었으면 빈 쉘만 나감.
            numPartiesToCreate = 1; // 최소 1개의 파티 틀 (캐릭터가 없으면 비어있을 것임)
        }
        if (charactersForPartyBuilding.isEmpty() && !allCharacters.isEmpty()) {
            numPartiesToCreate = (int) Math.ceil((double) allCharacters.size() / 4.0);
        } else if (!charactersForPartyBuilding.isEmpty()) {
            numPartiesToCreate = (int) Math.ceil((double) charactersForPartyBuilding.size() / 4.0);
        } else if (allCharacters.isEmpty() && numPartiesToCreate == 0) { // 모든 입력이 비었을 경우
            numPartiesToCreate = 1;
        }


        for (int i = 0; i < numPartiesToCreate; i++) {
            partyShells.add(new PartyShell(i, 4)); // 4인 파티
        }

        if (charactersForPartyBuilding.isEmpty()) {
            return partyShells.stream()
                    .map(shell -> shell.getMembers().stream().map(CharacterInfo::toMap).collect(Collectors.toList()))
                    .collect(Collectors.toList());
        }

        // (2) 탱커 배분
        List<CharacterInfo> availableTanks = charactersForPartyBuilding.stream()
                .filter(c -> "탱커".equals(c.getRole()))
                .sorted() // CharacterInfo에 compareTo 구현 (전투력 내림차순)
                .collect(Collectors.toList());

        for (CharacterInfo tank : availableTanks) {
            if (usedCharacterNames.contains(tank.getName())) continue;
            for (PartyShell shell : partyShells) {
                if (shell.getMembers().size() < shell.getPartySize() &&
                        shell.getMembers().stream().noneMatch(m -> "탱커".equals(m.getRole())) &&
                        !shell.getOwnerIndexSet().contains(tank.getOwnerIndex())) {
                    shell.addMember(tank);
                    usedCharacterNames.add(tank.getName());
                    break;
                }
            }
        }

        // (3) 힐러 배분 (조건1: 탱커 없는 파티 우선)
        List<CharacterInfo> availableHealers = charactersForPartyBuilding.stream()
                .filter(c -> "힐러".equals(c.getRole()) && !usedCharacterNames.contains(c.getName()))
                .sorted()
                .collect(Collectors.toList());

        // 힐러 배정을 위해 파티 우선순위 정렬
        partyShells.sort((ps1, ps2) -> {
            boolean ps1HasTank = ps1.getMembers().stream().anyMatch(m -> "탱커".equals(m.getRole()));
            boolean ps2HasTank = ps2.getMembers().stream().anyMatch(m -> "탱커".equals(m.getRole()));
            if (!ps1HasTank && ps2HasTank) return -1; // ps1 (탱커 없음) 우선
            if (ps1HasTank && !ps2HasTank) return 1;  // ps2 (탱커 없음) 우선
            return Integer.compare(ps1.getMembers().size(), ps2.getMembers().size()); // 멤버 수 적은 파티 우선
        });

        for (CharacterInfo healer : availableHealers) {
            if (usedCharacterNames.contains(healer.getName())) continue;
            for (PartyShell shell : partyShells) { // 정렬된 쉘 순서대로
                if (shell.getMembers().size() < shell.getPartySize() &&
                        shell.getMembers().stream().noneMatch(m -> "힐러".equals(m.getRole())) &&
                        !shell.getOwnerIndexSet().contains(healer.getOwnerIndex())) {
                    shell.addMember(healer);
                    usedCharacterNames.add(healer.getName());
                    break;
                }
            }
        }
        // 힐러 배정 후 원래 순서로 돌리거나, 이후 딜러 배정 시 다시 정렬

        // (4) 딜러 배분 (통합된 로직: 약한 파티가 가장 강한 가용 딜러 선택)
        List<CharacterInfo> availableDealers = charactersForPartyBuilding.stream()
                .filter(c -> "딜러".equals(c.getRole()) && !usedCharacterNames.contains(c.getName()))
                .sorted() // 전투력 내림차순
                .collect(Collectors.toList());

        boolean dealerPlacedInAnyPartyThisCycle = true;
        while (dealerPlacedInAnyPartyThisCycle && !availableDealers.isEmpty()) {
            dealerPlacedInAnyPartyThisCycle = false;

            List<PartyShell> partiesNeedingDealers = partyShells.stream()
                    .filter(s -> s.getMembers().size() < s.getPartySize())
                    .collect(Collectors.toList());

            if (partiesNeedingDealers.isEmpty()) break;

            // 평균 전투력 낮은 순 정렬
            partiesNeedingDealers.sort(Comparator.comparingDouble(PartyShell::getCurrentAveragePower)
                    .thenComparingInt(s -> s.getMembers().size()));

            boolean breakOuterLoopForReSort = false; // 한 명 배치 후 전체 재정렬을 위한 플래그

            for (PartyShell targetParty : partiesNeedingDealers) {
                if (targetParty.getMembers().size() >= targetParty.getPartySize() || availableDealers.isEmpty()) continue;

                int assignedDealerIndex = -1;
                for (int i = 0; i < availableDealers.size(); i++) {
                    CharacterInfo dealer = availableDealers.get(i);
                    if (!targetParty.getOwnerIndexSet().contains(dealer.getOwnerIndex())) {
                        boolean canAddDealer = true;
                        // 조건2: 4번째 멤버로 추가 시 전체 원거리 파티 방지
                        if (targetParty.getMembers().size() == 3) {
                            long currentMeleeCount = targetParty.getMembers().stream()
                                    .filter(m -> "근접".equals(CLASS_DATA.get(m.getJob()).getType())).count();
                            if (currentMeleeCount == 0 && "원거리".equals(CLASS_DATA.get(dealer.getJob()).getType())) {
                                canAddDealer = false;
                            }
                        }

                        if (canAddDealer) {
                            targetParty.addMember(dealer);
                            usedCharacterNames.add(dealer.getName());
                            assignedDealerIndex = i;
                            dealerPlacedInAnyPartyThisCycle = true;
                            breakOuterLoopForReSort = true; // 한 명 배치했으니 전체 재정렬
                            break;
                        }
                    }
                }

                if (assignedDealerIndex != -1) {
                    availableDealers.remove(assignedDealerIndex);
                }
                if (breakOuterLoopForReSort) break; // 가장 약한 파티에 한 명 배치 후, 다시 전체 while 루프 시작
            }
            if (!dealerPlacedInAnyPartyThisCycle) break; // 이번 사이클에 아무도 배치 못했으면 종료
        }

        // (5) 최종 파티 목록 변환 (List<PartyShell> -> List<List<Map<String, Object>>>)
        List<List<Map<String, Object>>> resultParties = new ArrayList<>();
        for (PartyShell shell : partyShells) {
            List<Map<String, Object>> partyMembersMap = new ArrayList<>();
            for (CharacterInfo member : shell.getMembers()) {
                partyMembersMap.add(member.toMap());
            }
            resultParties.add(partyMembersMap);
        }
        return resultParties;
    }

    @Override
    public List<List<Map<String, Object>>> makeGlassGivneRaidParty(
            Map<String, List<Map<String, Object>>> charactersByOwner,
            int healerCountPerParty,
            int minCombatPower) {

        // 1. 입력 데이터 변환 (makeAbyssRaidParty와 동일)
        List<CharacterInfo> allCharacters = new ArrayList<>();
        Map<String, Integer> ownerNameToIndexMap = new HashMap<>();
        int ownerIdxCounter = 0;
        for (Map.Entry<String, List<Map<String, Object>>> entry : charactersByOwner.entrySet()) {
            String ownerId = entry.getKey();
            if (!ownerNameToIndexMap.containsKey(ownerId)) {
                ownerNameToIndexMap.put(ownerId, ownerIdxCounter++);
            }
            int currentOwnerIndex = ownerNameToIndexMap.get(ownerId);
            for (Map<String, Object> charMap : entry.getValue()) {
                String name = (String) charMap.get("name");
                int power = ((Number) charMap.get("power")).intValue();
                String job = (String) charMap.get("job");
                if (name != null && job != null) {
                    allCharacters.add(new CharacterInfo(name, power, job, ownerId, currentOwnerIndex, CLASS_DATA));
                }
            }
        }

        // JavaScript의 generate8ManParties_advanced 로직을 여기에 Java로 구현
        List<CharacterInfo> charactersForPartyBuilding = allCharacters.stream()
                .filter(c -> c.getPower() >= minCombatPower)
                .collect(Collectors.toList());

        List<PartyShell> partyShells = new ArrayList<>();
        Set<String> usedCharacterNames = new HashSet<>();

        // (1) 파티 '틀' 생성
        int numPartiesToCreate = 0;
        // (numPartiesToCreate 계산 로직은 4인과 유사하나, 파티 사이즈는 8)
        if (!allCharacters.isEmpty()) {
            numPartiesToCreate = (int) Math.ceil((double) allCharacters.size() / 8.0);
        } else {
            numPartiesToCreate = 1;
        }
        if (charactersForPartyBuilding.isEmpty() && !allCharacters.isEmpty()) {
            numPartiesToCreate = (int) Math.ceil((double) allCharacters.size() / 8.0);
        } else if (!charactersForPartyBuilding.isEmpty()) {
            numPartiesToCreate = (int) Math.ceil((double) charactersForPartyBuilding.size() / 8.0);
        } else if (allCharacters.isEmpty() && numPartiesToCreate == 0) {
            numPartiesToCreate = 1;
        }

        for (int i = 0; i < numPartiesToCreate; i++) {
            partyShells.add(new PartyShell(i, 8)); // 8인 파티
        }

        if (charactersForPartyBuilding.isEmpty()) {
            return partyShells.stream()
                    .map(shell -> shell.getMembers().stream().map(CharacterInfo::toMap).collect(Collectors.toList()))
                    .collect(Collectors.toList());
        }

        // 역할별 사용 가능한 캐릭터 목록 (초기화)
        List<CharacterInfo> availableHealers = charactersForPartyBuilding.stream()
                .filter(c -> "힐러".equals(c.getRole()))
                .sorted()
                .collect(Collectors.toList());
        List<CharacterInfo> availableTanks = charactersForPartyBuilding.stream()
                .filter(c -> "탱커".equals(c.getRole()))
                .sorted()
                .collect(Collectors.toList());
        List<CharacterInfo> availableDealers = charactersForPartyBuilding.stream()
                .filter(c -> "딜러".equals(c.getRole()))
                .sorted()
                .collect(Collectors.toList());

        // (8인) 1. 목표 힐러 수 기반 힐러 배분
        for (int round = 0; round < healerCountPerParty; round++) {
            partyShells.sort(Comparator.comparingInt((PartyShell s) -> s.getHealersAssigned())
                    .thenComparingDouble(PartyShell::getCurrentAveragePower)
                    .thenComparingInt(s -> s.getMembers().size()));
            for (PartyShell shell : partyShells) {
                if (shell.getMembers().size() < shell.getPartySize() && shell.getHealersAssigned() < (round + 1) && !availableHealers.isEmpty()) {
                    int healerIdx = findAndAssignCharacter(shell, availableHealers, usedCharacterNames, null);
                    if (healerIdx != -1) availableHealers.remove(healerIdx);
                }
            }
        }

        // (8인) 2. 탱커 균등 배분 (예: 파티당 1~2명)
        // 8인 레이드는 보통 파티당 1~2탱이므로, 최대 2라운드 시도 또는 전체 탱커 수에 따라 동적 조절
        int maxTankRounds = Math.min(2, availableTanks.isEmpty() ? 0 : (int)Math.ceil((double)availableTanks.size() / partyShells.size()));
        if (availableTanks.size() > 0 && maxTankRounds == 0) maxTankRounds = 1; // 최소 1라운드는 시도 (탱커가 있다면)


        for (int round = 0; round < maxTankRounds; round++) {
            partyShells.sort(Comparator.comparingInt((PartyShell s) -> s.getTanksAssigned())
                    .thenComparingDouble(PartyShell::getCurrentAveragePower)
                    .thenComparingInt(s -> s.getMembers().size()));
            for (PartyShell shell : partyShells) {
                if (shell.getMembers().size() < shell.getPartySize() && shell.getTanksAssigned() < (round + 1) && !availableTanks.isEmpty()) {
                    int tankIdx = findAndAssignCharacter(shell, availableTanks, usedCharacterNames, null);
                    if (tankIdx != -1) availableTanks.remove(tankIdx);
                }
            }
        }

        // (8인) 3. 잔여 힐러 배분
        // 사용된 캐릭터를 availableHealers에서 제거하는 로직이 이미 위에서 수행되었으므로, 그대로 사용
        boolean placedSurplusHealer;
        do {
            placedSurplusHealer = false;
            if (availableHealers.isEmpty()) break;
            partyShells.sort(Comparator.comparingDouble(PartyShell::getCurrentAveragePower)
                    .thenComparingInt(s -> s.getMembers().size()));
            for (PartyShell shell : partyShells) {
                if (shell.getMembers().size() < shell.getPartySize() && !availableHealers.isEmpty()) {
                    int healerIdx = findAndAssignCharacter(shell, availableHealers, usedCharacterNames, null);
                    if (healerIdx != -1) {
                        availableHealers.remove(healerIdx);
                        placedSurplusHealer = true;
                        break; // 한명 배치 후 다시 정렬 및 시도
                    }
                }
            }
        } while (placedSurplusHealer);


        // (8인) 4. 딜러 배분
        boolean placedDealerInAnyPartyThisCycle = true;
        while(placedDealerInAnyPartyThisCycle && !availableDealers.isEmpty()) {
            placedDealerInAnyPartyThisCycle = false;
            List<PartyShell> partiesNeedingDealers = partyShells.stream()
                    .filter(s -> s.getMembers().size() < s.getPartySize())
                    .collect(Collectors.toList());

            if(partiesNeedingDealers.isEmpty()) break;

            partiesNeedingDealers.sort(Comparator.comparingDouble(PartyShell::getCurrentAveragePower)
                    .thenComparingInt(s -> s.getMembers().size()));

            boolean breakOuterLoopForReSort = false;
            for(PartyShell targetParty : partiesNeedingDealers) {
                if (targetParty.getMembers().size() >= targetParty.getPartySize() || availableDealers.isEmpty()) continue;

                // 8인에서는 4인과 같은 '전체 원거리 금지' 조건은 일단 적용하지 않음 (필요시 추가)
                int dealerIdx = findAndAssignCharacter(targetParty, availableDealers, usedCharacterNames, null); // 마지막 인자로 조건 함수 전달 가능
                if (dealerIdx != -1) {
                    availableDealers.remove(dealerIdx);
                    placedDealerInAnyPartyThisCycle = true;
                    breakOuterLoopForReSort = true;
                    break;
                }
            }
            if(!placedDealerInAnyPartyThisCycle) break; // 이번 사이클에 아무도 배치 못했으면 종료
        }


        // (5) 최종 파티 목록 변환
        List<List<Map<String, Object>>> resultParties = new ArrayList<>();
        for (PartyShell shell : partyShells) {
            resultParties.add(shell.getMembers().stream().map(CharacterInfo::toMap).collect(Collectors.toList()));
        }
        return resultParties;
    }

    // 캐릭터 할당을 위한 헬퍼 메소드 (중복 로직 감소)
    private int findAndAssignCharacter(PartyShell shell, List<CharacterInfo> availableChars, Set<String> usedCharacterNames, Predicate<CharacterInfo> additionalCondition) {
        for (int i = 0; i < availableChars.size(); i++) {
            CharacterInfo character = availableChars.get(i);
            if (!usedCharacterNames.contains(character.getName()) && !shell.getOwnerIndexSet().contains(character.getOwnerIndex())) {
                if (additionalCondition == null || additionalCondition.test(character)) {
                    shell.addMember(character); // addMember 내부에서 healersAssigned, tanksAssigned 등 업데이트 필요
                    usedCharacterNames.add(character.getName());
                    return i; // 할당된 캐릭터의 인덱스 반환
                }
            }
        }
        return -1; // 적합한 캐릭터 없음
    }
}
