package com.wordcount.a2025_12_20.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.wordcount.a2025_12_20.entity.ApplyRecord;

import java.util.List;

public interface ApplyRecordService extends IService<ApplyRecord> {
    IPage<ApplyRecord> selectApplyPage(Page<ApplyRecord> page, Integer clubId, Integer userId, Integer status);
    
    List<ApplyRecord> getApplyRecordsByClubId(Integer clubId);
    
    List<ApplyRecord> getApplyRecordsByUserId(Integer userId);
}