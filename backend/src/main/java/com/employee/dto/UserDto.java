package com.employee.dto;

import lombok.Data;

import java.util.Set;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String password;
    private boolean active;
    private Set<String> roles;
}
