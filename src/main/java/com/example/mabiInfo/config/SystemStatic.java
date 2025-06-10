package com.example.mabiInfo.config;

import com.example.mabiInfo.model.RoleDetail;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SystemStatic {
    public static final Map<String, RoleDetail> CLASS_DATA = new HashMap<>();
    static {
        CLASS_DATA.put("전사", new RoleDetail(List.of("탱커"), "근접"));
        CLASS_DATA.put("대검전사", new RoleDetail(List.of("탱커", "딜러"), "근접"));
        CLASS_DATA.put("검술사", new RoleDetail(List.of("딜러"), "근접"));
        CLASS_DATA.put("마법사", new RoleDetail(List.of("딜러"), "원거리"));
        CLASS_DATA.put("화염술사", new RoleDetail(List.of("딜러"), "원거리"));
        CLASS_DATA.put("빙결술사", new RoleDetail(List.of("탱커"), "근접")); // JS와 동일하게 역할 수정
        CLASS_DATA.put("전격술사", new RoleDetail(List.of("딜러"), "원거리"));
        CLASS_DATA.put("궁수", new RoleDetail(List.of("딜러"), "원거리"));
        CLASS_DATA.put("석궁사수", new RoleDetail(List.of("딜러"), "원거리"));
        CLASS_DATA.put("장궁병", new RoleDetail(List.of("딜러"), "원거리"));
        CLASS_DATA.put("음유시인", new RoleDetail(List.of("딜러"), "원거리"));
        CLASS_DATA.put("악사", new RoleDetail(List.of("딜러"), "원거리"));
        CLASS_DATA.put("댄서", new RoleDetail(List.of("딜러"), "근접"));
        CLASS_DATA.put("힐러", new RoleDetail(List.of("힐러"), "원거리"));
        CLASS_DATA.put("수도사", new RoleDetail(List.of("탱커", "힐러"), "근접"));
        CLASS_DATA.put("사제", new RoleDetail(List.of("힐러"), "원거리"));
        CLASS_DATA.put("도적", new RoleDetail(List.of("딜러"), "근접"));
        CLASS_DATA.put("듀얼블레이드", new RoleDetail(List.of("딜러"), "근접"));
        CLASS_DATA.put("격투가", new RoleDetail(List.of("딜러"), "근접"));
    }
}
