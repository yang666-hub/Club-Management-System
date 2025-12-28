package com.wordcount.a2025_12_20.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wordcount.a2025_12_20.entity.User;
import com.wordcount.a2025_12_20.mapper.UserMapper;
import com.wordcount.a2025_12_20.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;
import org.springframework.util.StringUtils;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Override
    public User findByUsername(String username) {
        QueryWrapper<User> wrapper = new QueryWrapper<>();
        wrapper.eq("username", username);
        return getOne(wrapper);
    }

    @Override
    public IPage<User> selectUserPage(Page<User> page, String keyword) {
        QueryWrapper<User> wrapper = new QueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like("username", keyword)
                    .or().like("real_name", keyword)
                    .or().like("phone", keyword)
                    .or().like("email", keyword));
        }
        wrapper.orderByDesc("create_time");
        return page(page, wrapper);
    }

    @Override
    public boolean registerUser(User user) {
        // 检查用户名是否已存在
        User existUser = findByUsername(user.getUsername());
        if (existUser != null) {
            return false;
        }
        
        // 密码加密
        String encryptedPassword = DigestUtils.md5DigestAsHex(user.getPassword().getBytes());
        user.setPassword(encryptedPassword);
        user.setUserType(1); // 默认为普通用户
        user.setStatus(1); // 默认启用
        return save(user);
    }

    @Override
    public User loginUser(String username, String password) {
        String encryptedPassword = DigestUtils.md5DigestAsHex(password.getBytes());
        QueryWrapper<User> wrapper = new QueryWrapper<>();
        wrapper.eq("username", username)
                .eq("password", encryptedPassword)
                .eq("status", 1);
        return getOne(wrapper);
    }
}