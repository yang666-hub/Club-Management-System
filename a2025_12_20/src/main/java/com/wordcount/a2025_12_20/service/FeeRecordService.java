package com.wordcount.a2025_12_20.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.wordcount.a2025_12_20.entity.FeeRecord;

import java.util.List;

public interface FeeRecordService extends IService<FeeRecord> {
    IPage<FeeRecord> selectFeePage(Page<FeeRecord> page, Integer clubId, Integer userId, Integer status);
    
    List<FeeRecord> getFeeRecordsByClubId(Integer clubId);
    
    List<FeeRecord> getFeeRecordsByUserId(Integer userId);
}