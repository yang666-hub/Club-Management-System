package com.wordcount.a2025_12_20.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wordcount.a2025_12_20.common.Result;
import com.wordcount.a2025_12_20.entity.Notice;
import com.wordcount.a2025_12_20.service.NoticeService;
import com.wordcount.a2025_12_20.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notice")
@CrossOrigin
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/list")
    public Result<IPage<Notice>> listNotices(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer clubId,
            @RequestParam(required = false) Integer status) {
        
        Page<Notice> page = new Page<>(current, size);
        IPage<Notice> noticePage = noticeService.selectNoticePage(page, keyword, clubId, status);
        return Result.success(noticePage);
    }

    @GetMapping("/detail/{id}")
    public Result<Notice> getNoticeDetail(@PathVariable Integer id) {
        Notice notice = noticeService.getById(id);
        if (notice != null) {
            return Result.success(notice);
        }
        return Result.error("通知不存在");
    }

    @GetMapping("/club/{clubId}")
    public Result<List<Notice>> getNoticesByClubId(@PathVariable Integer clubId) {
        List<Notice> notices = noticeService.getNoticesByClubId(clubId);
        return Result.success(notices);
    }

    @PostMapping("/add")
    public Result<String> addNotice(@RequestBody Notice notice, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有系统管理员和社团管理员可以添加通知
        if (userType < 2) {
            return Result.error("无权限添加通知");
        }
        
        notice.setCreatorId(userId);
        notice.setStatus(0); // 默认草稿状态
        boolean result = noticeService.save(notice);
        if (result) {
            return Result.success("添加成功");
        }
        return Result.error("添加失败");
    }

    @PutMapping("/update")
    public Result<String> updateNotice(@RequestBody Notice notice, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        Notice existingNotice = noticeService.getById(notice.getId());
        if (existingNotice == null) {
            return Result.error("通知不存在");
        }
        
        // 只有系统管理员和该通知的创建者可以修改通知信息
        if (userType != 3 && !userId.equals(existingNotice.getCreatorId())) {
            return Result.error("无权限修改此通知信息");
        }
        
        boolean result = noticeService.updateById(notice);
        if (result) {
            return Result.success("更新成功");
        }
        return Result.error("更新失败");
    }

    @PutMapping("/publish/{id}")
    public Result<String> publishNotice(@PathVariable Integer id, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        Notice notice = noticeService.getById(id);
        if (notice == null) {
            return Result.error("通知不存在");
        }
        
        // 只有系统管理员和该通知的创建者可以发布通知
        if (userType != 3 && !userId.equals(notice.getCreatorId())) {
            return Result.error("无权限发布此通知");
        }
        
        notice.setStatus(1); // 发布状态
        boolean result = noticeService.updateById(notice);
        if (result) {
            return Result.success("发布成功");
        }
        return Result.error("发布失败");
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> deleteNotice(@PathVariable Integer id, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        Notice notice = noticeService.getById(id);
        if (notice == null) {
            return Result.error("通知不存在");
        }
        
        // 只有系统管理员和该通知的创建者可以删除通知
        if (userType != 3 && !userId.equals(notice.getCreatorId())) {
            return Result.error("无权限删除此通知");
        }
        
        boolean result = noticeService.removeById(id);
        if (result) {
            return Result.success("删除成功");
        }
        return Result.error("删除失败");
    }
}