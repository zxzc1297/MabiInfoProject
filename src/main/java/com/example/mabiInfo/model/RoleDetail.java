package com.example.mabiInfo.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RoleDetail {
    private List<String> roles;
    private String type; // "근접" 또는 "원거리"

    public String getPrimaryRole() {
        return (roles != null && !roles.isEmpty()) ? roles.get(0) : "";
    }
}
