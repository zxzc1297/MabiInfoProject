package com.example.mabiInfo.model;
import lombok.Getter;
import lombok.ToString;
import java.util.HashMap;
import java.util.Map;

@Getter
@ToString
public class CharacterInfo implements Comparable<CharacterInfo> {
    private String name;
    private int power;
    private String job;
    private String role; // 주 역할
    private String attackType; // 공격 타입
    private String ownerId;
    private int ownerIndex;

    // Lombok으로 대체하지 않고 그대로 둡니다.
    public CharacterInfo(String name, int power, String job, String ownerId, int ownerIndex, Map<String, RoleDetail> jobsData) {
        this.name = name;
        this.power = power;
        this.job = job;
        this.ownerId = ownerId;
        this.ownerIndex = ownerIndex;

        RoleDetail detail = jobsData.get(job);
        if (detail != null) {
            this.role = detail.getPrimaryRole();
            this.attackType = detail.getType();
        } else {
            this.role = ""; // 또는 "알수없음"
            this.attackType = "";
        }
    }

    // 커스텀 정렬 로직은 그대로 유지합니다.
    @Override
    public int compareTo(CharacterInfo other) {
        return Integer.compare(other.power, this.power); // 전투력 내림차순
    }

    // 커스텀 변환 로직은 그대로 유지합니다.
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("name", this.name);
        map.put("power", this.power);
        map.put("job", this.job);
        map.put("role", this.role);
        map.put("type", this.attackType);
        map.put("owner", this.ownerId);
        map.put("ownerIndex", this.ownerIndex);
        return map;
    }
}
