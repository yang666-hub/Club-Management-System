package com.wordcount.a2025_12_20.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("club")
public class Club implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Integer id;
    
    private String name;
    
    private String description;
    
    private Integer clubTypeId;
    
    private String logo;
    
    private String establishedTime;
    
    private Integer memberCount;
    
    private Integer status; // 0-待审核 1-正常 2-解散
    
    private Integer adminId; // 社团管理员ID
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}