package com.wordcount.a2025_12_20.dto;

import lombok.Data;

@Data
public class UserRegisterDTO {
    private String username;
    private String password;
    private String realName;
    private String sex;
    private String phone;
    private String email;
}