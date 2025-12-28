package com.wordcount.a2025_12_20.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.wordcount.a2025_12_20.mapper")
public class MyBatisConfig {
    // MyBatis配置
}