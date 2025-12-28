package com.wordcount.a2025_12_20.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wordcount.a2025_12_20.entity.ClubMember;
import com.wordcount.a2025_12_20.mapper.ClubMemberMapper;
import com.wordcount.a2025_12_20.service.ClubMemberService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClubMemberServiceImpl extends ServiceImpl<ClubMemberMapper, ClubMember> implements ClubMemberService {

    @Override
    public List<ClubMember> getMembersByClubId(Integer clubId) {
        QueryWrapper<ClubMember> wrapper = new QueryWrapper<>();
        wrapper.eq("club_id", clubId)
                .eq("status", 1);
        return list(wrapper);
    }

    @Override
    public ClubMember getMemberByClubAndUser(Integer clubId, Integer userId) {
        QueryWrapper<ClubMember> wrapper = new QueryWrapper<>();
        wrapper.eq("club_id", clubId)
                .eq("user_id", userId);
        return getOne(wrapper);
    }
}