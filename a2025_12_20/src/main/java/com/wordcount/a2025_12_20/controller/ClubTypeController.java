package com.wordcount.a2025_12_20.controller;

import com.wordcount.a2025_12_20.common.Result;
import com.wordcount.a2025_12_20.entity.ClubType;
import com.wordcount.a2025_12_20.service.ClubTypeService;
import com.wordcount.a2025_12_20.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubType")
@CrossOrigin
public class ClubTypeController {

    @Autowired
    private ClubTypeService clubTypeService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/list")
    public Result<List<ClubType>> listClubTypes() {
        List<ClubType> clubTypes = clubTypeService.list();
        return Result.success(clubTypes);
    }

    @GetMapping("/detail/{id}")
    public Result<ClubType> getClubTypeDetail(@PathVariable Integer id) {
        ClubType clubType = clubTypeService.getById(id);
        if (clubType != null) {
            return Result.success(clubType);
        }
        return Result.error("社团类型不存在");
    }

    @PostMapping("/add")
    public Result<String> addClubType(@RequestBody ClubType clubType, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有系统管理员可以添加社团类型
        if (userType != 3) {
            return Result.error("无权限添加社团类型");
        }
        
        boolean result = clubTypeService.save(clubType);
        if (result) {
            return Result.success("添加成功");
        }
        return Result.error("添加失败");
    }

    @PutMapping("/update")
    public Result<String> updateClubType(@RequestBody ClubType clubType, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有系统管理员可以修改社团类型
        if (userType != 3) {
            return Result.error("无权限修改社团类型");
        }
        
        boolean result = clubTypeService.updateById(clubType);
        if (result) {
            return Result.success("更新成功");
        }
        return Result.error("更新失败");
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> deleteClubType(@PathVariable Integer id, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有系统管理员可以删除社团类型
        if (userType != 3) {
            return Result.error("无权限删除社团类型");
        }
        
        boolean result = clubTypeService.removeById(id);
        if (result) {
            return Result.success("删除成功");
        }
        return Result.error("删除失败");
    }
}