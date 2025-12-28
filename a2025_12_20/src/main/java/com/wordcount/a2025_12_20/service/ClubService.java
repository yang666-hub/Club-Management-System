package com.wordcount.a2025_12_20.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.wordcount.a2025_12_20.entity.Club;

public interface ClubService extends IService<Club> {
    IPage<Club> selectClubPage(Page<Club> page, String keyword, Integer clubTypeId);
}