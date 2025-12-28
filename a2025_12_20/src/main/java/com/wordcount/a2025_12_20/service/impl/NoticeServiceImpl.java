package com.wordcount.a2025_12_20.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wordcount.a2025_12_20.entity.Notice;
import com.wordcount.a2025_12_20.mapper.NoticeMapper;
import com.wordcount.a2025_12_20.service.NoticeService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class NoticeServiceImpl extends ServiceImpl<NoticeMapper, Notice> implements NoticeService {

    @Override
    public IPage<Notice> selectNoticePage(Page<Notice> page, String keyword, Integer clubId, Integer status) {
        QueryWrapper<Notice> wrapper = new QueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like("title", keyword)
                    .or().like("content", keyword));
        }
        if (clubId != null) {
            wrapper.eq("club_id", clubId);
        }
        if (status != null) {
            wrapper.eq("status", status);
        }
        wrapper.orderByDesc("create_time");
        return page(page, wrapper);
    }

    @Override
    public List<Notice> getNoticesByClubId(Integer clubId) {
        QueryWrapper<Notice> wrapper = new QueryWrapper<>();
        wrapper.eq("club_id", clubId)
                .orderByDesc("create_time");
        return list(wrapper);
    }
}