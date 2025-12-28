package com.wordcount.a2025_12_20.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("apply_record")
public class ApplyRecord implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Integer id;
    
    private Integer clubId;
    
    private Integer userId;
    
    private String reason;
    
    private Integer status; // 0-待审核 1-通过 2-拒绝
    
    private Integer reviewerId;
    
    private String reviewReason;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}