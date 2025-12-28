package com.wordcount.a2025_12_20.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.wordcount.a2025_12_20.entity.Activity;

import java.util.List;

public interface ActivityService extends IService<Activity> {
    IPage<Activity> selectActivityPage(Page<Activity> page, String keyword, Integer clubId);
    
    List<Activity> getActivitiesByClubId(Integer clubId);
}