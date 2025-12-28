package com.wordcount.a2025_12_20.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wordcount.a2025_12_20.entity.ClubType;
import com.wordcount.a2025_12_20.mapper.ClubTypeMapper;
import com.wordcount.a2025_12_20.service.ClubTypeService;
import org.springframework.stereotype.Service;

@Service
public class ClubTypeServiceImpl extends ServiceImpl<ClubTypeMapper, ClubType> implements ClubTypeService {
}