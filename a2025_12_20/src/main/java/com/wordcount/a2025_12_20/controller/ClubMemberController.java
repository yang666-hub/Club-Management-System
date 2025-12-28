package com.wordcount.a2025_12_20.controller;

import com.wordcount.a2025_12_20.common.Result;
import com.wordcount.a2025_12_20.entity.ClubMember;
import com.wordcount.a2025_12_20.entity.User;
import com.wordcount.a2025_12_20.service.ClubMemberService;
import com.wordcount.a2025_12_20.service.UserService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.wordcount.a2025_12_20.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubMember")
@CrossOrigin
public class ClubMemberController {

    @Autowired
    private ClubMemberService clubMemberService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/club/{clubId}")
    public Result<List<Map<String, Object>>> getMembersByClubId(@PathVariable Integer clubId, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有系统管理员和该社团的管理员可以查看社团成员列表
        if (userType < 2) {
            return Result.error("无权限查看此社团的成员列表");
        }
        
        List<ClubMember> members = clubMemberService.getMembersByClubId(clubId);
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (ClubMember member : members) {
            User user = userService.getById(member.getUserId());
            Map<String, Object> map = new HashMap<>();
            map.put("id", member.getId());
            map.put("clubId", member.getClubId());
            map.put("userId", member.getUserId());
            map.put("position", member.getPosition());
            map.put("status", member.getStatus());
            map.put("createTime", member.getCreateTime());
            map.put("updateTime", member.getUpdateTime());
            map.put("user", user);
            result.add(map);
        }
        
        return Result.success(result);
    }

    @GetMapping("/my")
    public Result<List<ClubMember>> getMyMemberships(@RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        
        // 这里需要在ClubMemberService中添加根据用户ID查找的方法
        // 目前暂时返回空列表
        return Result.success(List.of());
    }

    @PostMapping("/add")
    public Result<String> addMember(@RequestBody ClubMember clubMember, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有系统管理员和该社团的管理员可以添加成员
        if (userType < 2) {
            return Result.error("无权限添加成员");
        }
        
        // 设置默认状态
        clubMember.setStatus(1); // 正常状态
        boolean result = clubMemberService.save(clubMember);
        if (result) {
            return Result.success("添加成功");
        }
        return Result.error("添加失败");
    }

    @PutMapping("/update")
    public Result<String> updateMember(@RequestBody ClubMember clubMember, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有系统管理员和该社团的管理员可以修改成员信息
        if (userType < 2) {
            return Result.error("无权限修改成员信息");
        }
        
        boolean result = clubMemberService.updateById(clubMember);
        if (result) {
            return Result.success("更新成功");
        }
        return Result.error("更新失败");
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> deleteMember(@PathVariable Integer id, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有系统管理员和该社团的管理员可以删除成员
        if (userType < 2) {
            return Result.error("无权限删除成员");
        }
        
        boolean result = clubMemberService.removeById(id);
        if (result) {
            return Result.success("删除成功");
        }
        return Result.error("删除失败");
    }

    @PostMapping("/join")
    public Result<String> joinClub(@RequestBody ClubMember clubMember, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        
        // 设置用户ID和默认状态
        clubMember.setUserId(userId);
        clubMember.setStatus(0); // 待审核
        
        // 检查是否已经申请过
        ClubMember existingMember = clubMemberService.getMemberByClubAndUser(clubMember.getClubId(), userId);
        if (existingMember != null) {
            return Result.error("已申请过此社团");
        }
        
        boolean result = clubMemberService.save(clubMember);
        if (result) {
            return Result.success("申请成功");
        }
        return Result.error("申请失败");
    }

    @PutMapping("/approve/{id}")
    public Result<String> approveMember(@PathVariable Integer id, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有系统管理员和社团管理员可以审核成员申请
        if (userType < 2) {
            return Result.error("无权限审核成员申请");
        }
        
        ClubMember member = clubMemberService.getById(id);
        if (member == null) {
            return Result.error("成员记录不存在");
        }
        
        member.setStatus(1); // 通过
        boolean result = clubMemberService.updateById(member);
        if (result) {
            return Result.success("审核通过");
        }
        return Result.error("审核失败");
    }

    @PutMapping("/reject/{id}")
    public Result<String> rejectMember(@PathVariable Integer id, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有系统管理员和社团管理员可以审核成员申请
        if (userType < 2) {
            return Result.error("无权限审核成员申请");
        }
        
        ClubMember member = clubMemberService.getById(id);
        if (member == null) {
            return Result.error("成员记录不存在");
        }
        
        member.setStatus(2); // 拒绝
        boolean result = clubMemberService.updateById(member);
        if (result) {
            return Result.success("审核拒绝");
        }
        return Result.error("审核失败");
    }
}