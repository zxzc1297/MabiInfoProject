package com.example.mabiInfo.model;

import lombok.Data;
import lombok.Getter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Data
public class PartyShell {
    private int id;
    private int partySize;
    private List<CharacterInfo> members = new ArrayList<>();
    private Set<Integer> ownerIndexSet = new HashSet<>();
    private long totalPower = 0;
    private int healersAssigned = 0;
    private int tanksAssigned = 0;

    // 생성자는 특정 필드만 초기화하므로 그대로 둡니다.
    public PartyShell(int id, int partySize) {
        this.id = id;
        this.partySize = partySize;
    }

    // 파티의 상태를 변경하는 커스텀 메소드들은 그대로 유지합니다.
    public boolean addMember(CharacterInfo character) {
        if (members.size() < partySize && !ownerIndexSet.contains(character.getOwnerIndex())) {
            members.add(character);
            ownerIndexSet.add(character.getOwnerIndex());
            totalPower += character.getPower();

            // 역할군 카운트 업데이트
            if ("힐러".equals(character.getRole())) {
                healersAssigned++;
            } else if ("탱커".equals(character.getRole())) {
                tanksAssigned++;
            }
            return true;
        }
        return false;
    }

    public double getCurrentAveragePower() {
        return members.isEmpty() ? 0 : (double) totalPower / members.size();
    }

    public long countMeleeCharacters(Map<String, RoleDetail> jobsData) {
        return members.stream()
                .filter(m -> {
                    RoleDetail detail = jobsData.get(m.getJob());
                    return detail != null && "근접".equals(detail.getType());
                })
                .count();
    }
}
