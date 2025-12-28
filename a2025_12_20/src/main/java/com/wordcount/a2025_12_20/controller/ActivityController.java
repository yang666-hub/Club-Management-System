package com.wordcount.a2025_12_20.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wordcount.a2025_12_20.common.Result;
import com.wordcount.a2025_12_20.entity.Activity;
import com.wordcount.a2025_12_20.entity.Club;
import com.wordcount.a2025_12_20.service.ActivityService;
import com.wordcount.a2025_12_20.service.ClubService;
import com.wordcount.a2025_12_20.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activity")
@CrossOrigin
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ClubService clubService;

    @GetMapping("/list")
    public Result<IPage<Map<String, Object>>> listActivities(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer clubId,
            @RequestHeader("Authorization") String authorization) {
        
        Page<Activity> page = new Page<>(current, size);
        IPage<Activity> activityPage = activityService.selectActivityPage(page, keyword, clubId);
        
        // Convert Activity objects to maps with club information
        List<Map<String, Object>> resultList = new ArrayList<>();
        for (Activity activity : activityPage.getRecords()) {
            Map<String, Object> activityMap = new HashMap<>();
            // Add basic activity fields
            activityMap.put("id", activity.getId());
            activityMap.put("title", activity.getTitle());
            activityMap.put("content", activity.getContent());
            activityMap.put("startTime", activity.getStartTime());
            activityMap.put("endTime", activity.getEndTime());
            activityMap.put("location", activity.getLocation());
            activityMap.put("maxParticipants", activity.getMaxParticipants());
            activityMap.put("currentParticipants", activity.getCurrentParticipants());
            activityMap.put("status", activity.getStatus());
            activityMap.put("createTime", activity.getCreateTime());
            activityMap.put("updateTime", activity.getUpdateTime());
            activityMap.put("clubId", activity.getClubId());
            activityMap.put("creatorId", activity.getCreatorId());
            
            // Add club information
            if (activity.getClubId() != null) {
                Club club = clubService.getById(activity.getClubId());
                if (club != null) {
                    Map<String, Object> clubMap = new HashMap<>();
                    clubMap.put("id", club.getId());
                    clubMap.put("name", club.getName());
                    activityMap.put("club", clubMap);
                }
            }
            
            resultList.add(activityMap);
        }
        
        // Create new IPage with transformed data
        IPage<Map<String, Object>> resultPage = new Page<>();
        resultPage.setRecords(resultList);
        resultPage.setTotal(activityPage.getTotal());
        resultPage.setSize(activityPage.getSize());
        resultPage.setCurrent(activityPage.getCurrent());
        resultPage.setPages(activityPage.getPages());
        
        return Result.success(resultPage);
    }

    @GetMapping("/detail/{id}")
    public Result<Map<String, Object>> getActivityDetail(@PathVariable Integer id) {
        Activity activity = activityService.getById(id);
        if (activity != null) {
            Map<String, Object> activityMap = new HashMap<>();
            // Add basic activity fields
            activityMap.put("id", activity.getId());
            activityMap.put("title", activity.getTitle());
            activityMap.put("content", activity.getContent());
            activityMap.put("startTime", activity.getStartTime());
            activityMap.put("endTime", activity.getEndTime());
            activityMap.put("location", activity.getLocation());
            activityMap.put("maxParticipants", activity.getMaxParticipants());
            activityMap.put("currentParticipants", activity.getCurrentParticipants());
            activityMap.put("status", activity.getStatus());
            activityMap.put("createTime", activity.getCreateTime());
            activityMap.put("updateTime", activity.getUpdateTime());
            activityMap.put("clubId", activity.getClubId());
            activityMap.put("creatorId", activity.getCreatorId());
            
            // Add club information
            if (activity.getClubId() != null) {
                Club club = clubService.getById(activity.getClubId());
                if (club != null) {
                    Map<String, Object> clubMap = new HashMap<>();
                    clubMap.put("id", club.getId());
                    clubMap.put("name", club.getName());
                    activityMap.put("club", clubMap);
                }
            }
            
            return Result.success(activityMap);
        }
        return Result.error("活动不存在");
    }

    @GetMapping("/club/{clubId}")
    public Result<List<Map<String, Object>>> getActivitiesByClubId(@PathVariable Integer clubId) {
        List<Activity> activities = activityService.getActivitiesByClubId(clubId);
        
        // Convert Activity objects to maps with club information
        List<Map<String, Object>> resultList = new ArrayList<>();
        for (Activity activity : activities) {
            Map<String, Object> activityMap = new HashMap<>();
            // Add basic activity fields
            activityMap.put("id", activity.getId());
            activityMap.put("title", activity.getTitle());
            activityMap.put("content", activity.getContent());
            activityMap.put("startTime", activity.getStartTime());
            activityMap.put("endTime", activity.getEndTime());
            activityMap.put("location", activity.getLocation());
            activityMap.put("maxParticipants", activity.getMaxParticipants());
            activityMap.put("currentParticipants", activity.getCurrentParticipants());
            activityMap.put("status", activity.getStatus());
            activityMap.put("createTime", activity.getCreateTime());
            activityMap.put("updateTime", activity.getUpdateTime());
            activityMap.put("clubId", activity.getClubId());
            activityMap.put("creatorId", activity.getCreatorId());
            
            // Add club information
            if (activity.getClubId() != null) {
                Club club = clubService.getById(activity.getClubId());
                if (club != null) {
                    Map<String, Object> clubMap = new HashMap<>();
                    clubMap.put("id", club.getId());
                    clubMap.put("name", club.getName());
                    activityMap.put("club", clubMap);
                }
            }
            
            resultList.add(activityMap);
        }
        
        return Result.success(resultList);
    }

    @PostMapping("/add")
    public Result<String> addActivity(@RequestBody Activity activity, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有系统管理员和社团管理员可以添加活动
        if (userType < 2) {
            return Result.error("无权限添加活动");
        }
        
        activity.setCreatorId(userId);
        boolean result = activityService.save(activity);
        if (result) {
            return Result.success("添加成功");
        }
        return Result.error("添加失败");
    }

    @PutMapping("/update")
    public Result<String> updateActivity(@RequestBody Activity activity, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        Activity existingActivity = activityService.getById(activity.getId());
        if (existingActivity == null) {
            return Result.error("活动不存在");
        }
        
        // 只有系统管理员和该活动的创建者可以修改活动信息
        if (userType != 3 && !userId.equals(existingActivity.getCreatorId())) {
            return Result.error("无权限修改此活动信息");
        }
        
        boolean result = activityService.updateById(activity);
        if (result) {
            return Result.success("更新成功");
        }
        return Result.error("更新失败");
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> deleteActivity(@PathVariable Integer id, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        Activity activity = activityService.getById(id);
        if (activity == null) {
            return Result.error("活动不存在");
        }
        
        // 只有系统管理员和该活动的创建者可以删除活动
        if (userType != 3 && !userId.equals(activity.getCreatorId())) {
            return Result.error("无权限删除此活动");
        }
        
        boolean result = activityService.removeById(id);
        if (result) {
            return Result.success("删除成功");
        }
        return Result.error("删除失败");
    }
}