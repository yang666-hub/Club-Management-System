package com.wordcount.a2025_12_20.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.wordcount.a2025_12_20.entity.ClubMember;

import java.util.List;

public interface ClubMemberService extends IService<ClubMember> {
    List<ClubMember> getMembersByClubId(Integer clubId);
    
    ClubMember getMemberByClubAndUser(Integer clubId, Integer userId);
}