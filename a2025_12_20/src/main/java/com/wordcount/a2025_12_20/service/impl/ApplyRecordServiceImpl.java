package com.wordcount.a2025_12_20.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wordcount.a2025_12_20.entity.ApplyRecord;
import com.wordcount.a2025_12_20.mapper.ApplyRecordMapper;
import com.wordcount.a2025_12_20.service.ApplyRecordService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplyRecordServiceImpl extends ServiceImpl<ApplyRecordMapper, ApplyRecord> implements ApplyRecordService {

    @Override
    public IPage<ApplyRecord> selectApplyPage(Page<ApplyRecord> page, Integer clubId, Integer userId, Integer status) {
        QueryWrapper<ApplyRecord> wrapper = new QueryWrapper<>();
        if (clubId != null) {
            wrapper.eq("club_id", clubId);
        }
        if (userId != null) {
            wrapper.eq("user_id", userId);
        }
        if (status != null) {
            wrapper.eq("status", status);
        }
        wrapper.orderByDesc("create_time");
        return page(page, wrapper);
    }

    @Override
    public List<ApplyRecord> getApplyRecordsByClubId(Integer clubId) {
        QueryWrapper<ApplyRecord> wrapper = new QueryWrapper<>();
        wrapper.eq("club_id", clubId)
                .orderByDesc("create_time");
        return list(wrapper);
    }

    @Override
    public List<ApplyRecord> getApplyRecordsByUserId(Integer userId) {
        QueryWrapper<ApplyRecord> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId)
                .orderByDesc("create_time");
        return list(wrapper);
    }
}