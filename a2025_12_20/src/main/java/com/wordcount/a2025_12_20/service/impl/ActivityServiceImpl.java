package com.wordcount.a2025_12_20.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wordcount.a2025_12_20.entity.Activity;
import com.wordcount.a2025_12_20.mapper.ActivityMapper;
import com.wordcount.a2025_12_20.service.ActivityService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class ActivityServiceImpl extends ServiceImpl<ActivityMapper, Activity> implements ActivityService {

    @Override
    public IPage<Activity> selectActivityPage(Page<Activity> page, String keyword, Integer clubId) {
        QueryWrapper<Activity> wrapper = new QueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like("title", keyword)
                    .or().like("content", keyword));
        }
        if (clubId != null) {
            wrapper.eq("club_id", clubId);
        }
        wrapper.orderByDesc("create_time");
        return page(page, wrapper);
    }

    @Override
    public List<Activity> getActivitiesByClubId(Integer clubId) {
        QueryWrapper<Activity> wrapper = new QueryWrapper<>();
        wrapper.eq("club_id", clubId)
                .orderByDesc("create_time");
        return list(wrapper);
    }
}