package com.wordcount.a2025_12_20.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wordcount.a2025_12_20.entity.Club;
import com.wordcount.a2025_12_20.mapper.ClubMapper;
import com.wordcount.a2025_12_20.service.ClubService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class ClubServiceImpl extends ServiceImpl<ClubMapper, Club> implements ClubService {

    @Override
    public IPage<Club> selectClubPage(Page<Club> page, String keyword, Integer clubTypeId) {
        QueryWrapper<Club> wrapper = new QueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like("name", keyword)
                    .or().like("description", keyword));
        }
        if (clubTypeId != null) {
            wrapper.eq("club_type_id", clubTypeId);
        }
        wrapper.orderByDesc("create_time");
        return page(page, wrapper);
    }
}