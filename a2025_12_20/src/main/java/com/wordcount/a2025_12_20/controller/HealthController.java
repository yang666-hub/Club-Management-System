package com.wordcount.a2025_12_20.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public String health() {
        return "Campus Club Management System is running!";
    }

    @GetMapping("/test")
    public String test() {
        return "API Test Success!";
    }
}