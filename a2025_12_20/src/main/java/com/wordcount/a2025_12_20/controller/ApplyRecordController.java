package com.wordcount.a2025_12_20.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wordcount.a2025_12_20.common.Result;
import com.wordcount.a2025_12_20.entity.ApplyRecord;
import com.wordcount.a2025_12_20.entity.Club;
import com.wordcount.a2025_12_20.entity.User;
import com.wordcount.a2025_12_20.service.ApplyRecordService;
import com.wordcount.a2025_12_20.service.ClubService;
import com.wordcount.a2025_12_20.service.UserService;
import com.wordcount.a2025_12_20.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/apply")
@CrossOrigin
public class ApplyRecordController {

    @Autowired
    private ApplyRecordService applyRecordService;

    @Autowired
    private ClubService clubService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // 转换ApplyRecord为包含club和user信息的Map
    private Map<String, Object> convertApplyRecordToMap(ApplyRecord apply) {
        Map<String, Object> applyMap = new HashMap<>();
        // Add basic apply fields
        applyMap.put("id", apply.getId());
        applyMap.put("clubId", apply.getClubId());
        applyMap.put("userId", apply.getUserId());
        applyMap.put("reason", apply.getReason());
        applyMap.put("status", apply.getStatus());
        applyMap.put("reviewReason", apply.getReviewReason());
        applyMap.put("createTime", apply.getCreateTime());
        applyMap.put("updateTime", apply.getUpdateTime());
        applyMap.put("reviewerId", apply.getReviewerId());
        
        // Add club information
        if (apply.getClubId() != null) {
            Club club = clubService.getById(apply.getClubId());
            if (club != null) {
                Map<String, Object> clubMap = new HashMap<>();
                clubMap.put("id", club.getId());
                clubMap.put("name", club.getName());
                applyMap.put("club", clubMap);
            }
        }
        
        // Add user information
        if (apply.getUserId() != null) {
            User user = userService.getById(apply.getUserId());
            if (user != null) {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("username", user.getUsername());
                userMap.put("realName", user.getRealName());
                userMap.put("phone", user.getPhone());
                applyMap.put("user", userMap);
            }
        }
        
        return applyMap;
    }

    @GetMapping("/list")
    public Result<IPage<Map<String, Object>>> listApplies(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer clubId,
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) Integer status,
            @RequestHeader("Authorization") String authorization) {
        
        String token = authorization.replace("Bearer ", "");
        Integer currentUserId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 普通用户只能查看自己的申请记录
        if (userType == 1 && userId == null) {
            userId = currentUserId;
        }
        
        Page<ApplyRecord> page = new Page<>(current, size);
        IPage<ApplyRecord> applyPage = applyRecordService.selectApplyPage(page, clubId, userId, status);
        
        // 转换查询结果为包含club信息的Map
        List<Map<String, Object>> resultList = new ArrayList<>();
        for (ApplyRecord apply : applyPage.getRecords()) {
            resultList.add(convertApplyRecordToMap(apply));
        }
        
        // 创建新的IPage对象，保持分页信息不变
        IPage<Map<String, Object>> resultPage = new Page<>();
        resultPage.setCurrent(applyPage.getCurrent());
        resultPage.setSize(applyPage.getSize());
        resultPage.setTotal(applyPage.getTotal());
        resultPage.setRecords(resultList);
        
        return Result.success(resultPage);
    }

    @GetMapping("/my")
    public Result<List<Map<String, Object>>> getMyApplies(@RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        
        List<ApplyRecord> applies = applyRecordService.getApplyRecordsByUserId(userId);
        
        // Convert ApplyRecord objects to maps with club information
        List<Map<String, Object>> resultList = new ArrayList<>();
        for (ApplyRecord apply : applies) {
            resultList.add(convertApplyRecordToMap(apply));
        }
        
        return Result.success(resultList);
    }

    @GetMapping("/club/{clubId}")
    public Result<List<Map<String, Object>>> getClubApplies(@PathVariable Integer clubId, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有系统管理员和该社团的管理员可以查看社团的申请记录
        if (userType < 2) {
            return Result.error("无权限查看此社团的申请记录");
        }
        
        List<ApplyRecord> applies = applyRecordService.getApplyRecordsByClubId(clubId);
        
        // 转换查询结果为包含club信息的Map
        List<Map<String, Object>> resultList = new ArrayList<>();
        for (ApplyRecord apply : applies) {
            resultList.add(convertApplyRecordToMap(apply));
        }
        
        return Result.success(resultList);
    }

    @PostMapping("/add")
    public Result<String> addApply(@RequestBody ApplyRecord applyRecord, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        
        // 设置申请用户ID和默认状态
        applyRecord.setUserId(userId);
        applyRecord.setStatus(0); // 待审核
        
        boolean result = applyRecordService.save(applyRecord);
        if (result) {
            return Result.success("申请提交成功");
        }
        return Result.error("申请提交失败");
    }

    @PutMapping("/review")
    public Result<String> reviewApply(@RequestBody ApplyRecord applyRecord, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有系统管理员和社团管理员可以审核申请
        if (userType < 2) {
            return Result.error("无权限审核申请");
        }
        
        // 设置审核人
        applyRecord.setReviewerId(userId);
        
        boolean result = applyRecordService.updateById(applyRecord);
        if (result) {
            return Result.success("审核成功");
        }
        return Result.error("审核失败");
    }
}