package com.wordcount.a2025_12_20.controller;

import com.wordcount.a2025_12_20.mapper.ActivityMapper;
import com.wordcount.a2025_12_20.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/di")
public class DIController {

    @Autowired
    private ActivityMapper activityMapper;
    
    @Autowired
    private UserMapper userMapper;

    @GetMapping("/test")
    public String testDependencyInjection() {
        StringBuilder result = new StringBuilder();
        result.append("Dependency Injection Test\n");
        result.append("ActivityMapper: ").append(activityMapper != null ? "OK" : "FAIL").append("\n");
        result.append("UserMapper: ").append(userMapper != null ? "OK" : "FAIL").append("\n");
        return result.toString();
    }
}