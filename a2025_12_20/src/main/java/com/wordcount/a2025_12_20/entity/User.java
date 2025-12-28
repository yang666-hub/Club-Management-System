package com.wordcount.a2025_12_20.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("user")
public class User implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Integer id;
    
    private String username;
    
    private String password;
    
    private String realName;
    
    private String sex;
    
    private String phone;
    
    private String email;
    
    private String avatar;
    
    private Integer userType; // 1-普通用户 2-社团管理员 3-系统管理员
    
    private Integer clubId; // 如果是社团管理员，关联的社团ID
    
    private Integer status; // 0-禁用 1-启用
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}