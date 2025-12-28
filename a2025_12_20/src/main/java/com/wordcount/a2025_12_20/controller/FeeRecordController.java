package com.wordcount.a2025_12_20.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wordcount.a2025_12_20.common.Result;
import com.wordcount.a2025_12_20.entity.FeeRecord;
import com.wordcount.a2025_12_20.service.FeeRecordService;
import com.wordcount.a2025_12_20.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fee")
@CrossOrigin
public class FeeRecordController {

    @Autowired
    private FeeRecordService feeRecordService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/list")
    public Result<IPage<FeeRecord>> listFees(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer clubId,
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) Integer status,
            @RequestHeader("Authorization") String authorization) {
        
        String token = authorization.replace("Bearer ", "");
        Integer currentUserId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 普通用户只能查看自己的费用记录
        if (userType == 1 && userId == null) {
            userId = currentUserId;
        }
        
        Page<FeeRecord> page = new Page<>(current, size);
        IPage<FeeRecord> feePage = feeRecordService.selectFeePage(page, clubId, userId, status);
        return Result.success(feePage);
    }

    @GetMapping("/my")
    public Result<List<FeeRecord>> getMyFees(@RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        
        List<FeeRecord> fees = feeRecordService.getFeeRecordsByUserId(userId);
        return Result.success(fees);
    }

    @GetMapping("/club/{clubId}")
    public Result<List<FeeRecord>> getClubFees(@PathVariable Integer clubId, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有系统管理员和该社团的管理员可以查看社团的费用记录
        if (userType < 2) {
            return Result.error("无权限查看此社团的费用记录");
        }
        
        List<FeeRecord> fees = feeRecordService.getFeeRecordsByClubId(clubId);
        return Result.success(fees);
    }

    @PostMapping("/add")
    public Result<String> addFee(@RequestBody FeeRecord feeRecord, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有系统管理员和社团管理员可以添加费用记录
        if (userType < 2) {
            return Result.error("无权限添加费用记录");
        }
        
        feeRecord.setCreatorId(userId);
        feeRecord.setStatus(0); // 默认待缴费
        boolean result = feeRecordService.save(feeRecord);
        if (result) {
            return Result.success("添加成功");
        }
        return Result.error("添加失败");
    }

    @PutMapping("/update")
    public Result<String> updateFee(@RequestBody FeeRecord feeRecord, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        FeeRecord existingFee = feeRecordService.getById(feeRecord.getId());
        if (existingFee == null) {
            return Result.error("费用记录不存在");
        }
        
        // 只有系统管理员和该费用记录的创建者可以修改费用记录
        if (userType != 3 && !userId.equals(existingFee.getCreatorId())) {
            return Result.error("无权限修改此费用记录");
        }
        
        boolean result = feeRecordService.updateById(feeRecord);
        if (result) {
            return Result.success("更新成功");
        }
        return Result.error("更新失败");
    }

    @PutMapping("/pay/{id}")
    public Result<String> payFee(@PathVariable Integer id, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        FeeRecord feeRecord = feeRecordService.getById(id);
        if (feeRecord == null) {
            return Result.error("费用记录不存在");
        }
        
        // 只有系统管理员、社团管理员和费用记录对应的用户可以标记为已缴费
        if (userType < 2 && !userId.equals(feeRecord.getUserId())) {
            return Result.error("无权限标记此费用记录为已缴费");
        }
        
        feeRecord.setStatus(1); // 已缴费
        boolean result = feeRecordService.updateById(feeRecord);
        if (result) {
            return Result.success("缴费成功");
        }
        return Result.error("缴费失败");
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> deleteFee(@PathVariable Integer id, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        FeeRecord feeRecord = feeRecordService.getById(id);
        if (feeRecord == null) {
            return Result.error("费用记录不存在");
        }
        
        // 只有系统管理员和该费用记录的创建者可以删除费用记录
        if (userType != 3 && !userId.equals(feeRecord.getCreatorId())) {
            return Result.error("无权限删除此费用记录");
        }
        
        boolean result = feeRecordService.removeById(id);
        if (result) {
            return Result.success("删除成功");
        }
        return Result.error("删除失败");
    }
}