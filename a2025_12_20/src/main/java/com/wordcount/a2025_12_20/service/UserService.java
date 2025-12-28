package com.wordcount.a2025_12_20.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.wordcount.a2025_12_20.entity.User;

public interface UserService extends IService<User> {
    User findByUsername(String username);
    
    IPage<User> selectUserPage(Page<User> page, String keyword);
    
    boolean registerUser(User user);
    
    User loginUser(String username, String password);
}