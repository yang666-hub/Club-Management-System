package com.wordcount.a2025_12_20.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wordcount.a2025_12_20.common.Result;
import com.wordcount.a2025_12_20.entity.Club;
import com.wordcount.a2025_12_20.service.ClubService;
import com.wordcount.a2025_12_20.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/club")
@CrossOrigin
public class ClubController {

    @Autowired
    private ClubService clubService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/list")
    public Result<IPage<Club>> listClubs(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer clubTypeId,
            @RequestHeader("Authorization") String authorization) {
        
        Page<Club> page = new Page<>(current, size);
        IPage<Club> clubPage = clubService.selectClubPage(page, keyword, clubTypeId);
        return Result.success(clubPage);
    }

    @GetMapping("/detail/{id}")
    public Result<Club> getClubDetail(@PathVariable Integer id) {
        Club club = clubService.getById(id);
        if (club != null) {
            return Result.success(club);
        }
        return Result.error("社团不存在");
    }

    @PostMapping("/add")
    public Result<String> addClub(@RequestBody Club club, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有系统管理员和社团管理员可以添加社团
        if (userType < 2) {
            return Result.error("无权限添加社团");
        }
        
        club.setAdminId(userId);
        boolean result = clubService.save(club);
        if (result) {
            return Result.success("添加成功");
        }
        return Result.error("添加失败");
    }

    @PutMapping("/update")
    public Result<String> updateClub(@RequestBody Club club, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        Club existingClub = clubService.getById(club.getId());
        if (existingClub == null) {
            return Result.error("社团不存在");
        }
        
        // 只有系统管理员和该社团的管理员可以修改社团信息
        if (userType != 3 && !userId.equals(existingClub.getAdminId())) {
            return Result.error("无权限修改此社团信息");
        }
        
        boolean result = clubService.updateById(club);
        if (result) {
            return Result.success("更新成功");
        }
        return Result.error("更新失败");
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> deleteClub(@PathVariable Integer id, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        Club club = clubService.getById(id);
        if (club == null) {
            return Result.error("社团不存在");
        }
        
        // 只有系统管理员可以删除社团
        if (userType != 3) {
            return Result.error("无权限删除社团");
        }
        
        boolean result = clubService.removeById(id);
        if (result) {
            return Result.success("删除成功");
        }
        return Result.error("删除失败");
    }

    @GetMapping("/my")
    public Result<Club> getMyClub(@RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有社团管理员才能查看自己的社团
        if (userType != 2) {
            return Result.error("无权限");
        }
        
        // 根据管理员ID查找社团
        // 这里需要在ClubService中添加根据管理员ID查找社团的方法
        return Result.error("功能待实现");
    }
}