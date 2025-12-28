package com.wordcount.a2025_12_20.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wordcount.a2025_12_20.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}