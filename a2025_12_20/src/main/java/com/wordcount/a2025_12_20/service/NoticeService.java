package com.wordcount.a2025_12_20.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.wordcount.a2025_12_20.entity.Notice;

import java.util.List;

public interface NoticeService extends IService<Notice> {
    IPage<Notice> selectNoticePage(Page<Notice> page, String keyword, Integer clubId, Integer status);
    
    List<Notice> getNoticesByClubId(Integer clubId);
}