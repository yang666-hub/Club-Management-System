package com.wordcount.a2025_12_20.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wordcount.a2025_12_20.common.Result;
import com.wordcount.a2025_12_20.dto.UserLoginDTO;
import com.wordcount.a2025_12_20.dto.UserRegisterDTO;
import com.wordcount.a2025_12_20.entity.User;
import com.wordcount.a2025_12_20.service.UserService;
import com.wordcount.a2025_12_20.util.JwtUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public Result<String> register(@RequestBody UserRegisterDTO registerDTO) {
        User user = new User();
        BeanUtils.copyProperties(registerDTO, user);
        boolean result = userService.registerUser(user);
        if (result) {
            return Result.success("注册成功");
        } else {
            return Result.error("用户名已存在");
        }
    }

    @PostMapping("/login")
    public Result<String> login(@RequestBody UserLoginDTO loginDTO) {
        User user = userService.loginUser(loginDTO.getUsername(), loginDTO.getPassword());
        if (user != null) {
            String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getUserType());
            return Result.success(token);
        } else {
            return Result.error("用户名或密码错误");
        }
    }

    @GetMapping("/info")
    public Result<User> getUserInfo(@RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        User user = userService.getById(userId);
        if (user != null) {
            user.setPassword(null); // 不返回密码
            return Result.success(user);
        }
        return Result.error("获取用户信息失败");
    }

    @PutMapping("/update")
    public Result<String> updateUser(@RequestBody User user, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 普通用户只能修改自己的信息，管理员可以修改任何人
        if (userType != 3 && !userId.equals(user.getId())) {
            return Result.error("无权限修改此用户信息");
        }
        
        boolean result = userService.updateById(user);
        if (result) {
            return Result.success("更新成功");
        }
        return Result.error("更新失败");
    }

    @GetMapping("/list")
    public Result<IPage<User>> listUsers(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 系统管理员可以查看所有用户列表，社团管理员可以查看普通用户列表
        if (userType < 2) {
            return Result.error("无权限查看用户列表");
        }
        
        Page<User> page = new Page<>(current, size);
        IPage<User> userPage = userService.selectUserPage(page, keyword);
        userPage.getRecords().forEach(user -> user.setPassword(null));
        return Result.success(userPage);
    }

    @PostMapping("/add")
    public Result<String> addUser(@RequestBody User user, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有系统管理员可以添加用户
        if (userType != 3) {
            return Result.error("无权限添加用户");
        }
        
        // 检查用户名是否已存在
        User existUser = userService.findByUsername(user.getUsername());
        if (existUser != null) {
            return Result.error("用户名已存在");
        }
        
        boolean result = userService.save(user);
        if (result) {
            return Result.success("添加成功");
        }
        return Result.error("添加失败");
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> deleteUser(@PathVariable Integer id, @RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Integer userType = jwtUtil.getUserTypeFromToken(token);
        
        // 只有系统管理员可以删除用户，且不能删除自己
        if (userType != 3 || userId.equals(id)) {
            return Result.error("无权限删除此用户");
        }
        
        boolean result = userService.removeById(id);
        if (result) {
            return Result.success("删除成功");
        }
        return Result.error("删除失败");
    }
}