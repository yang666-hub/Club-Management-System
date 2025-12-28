package com.wordcount.a2025_12_20.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("fee_record")
public class FeeRecord implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Integer id;
    
    private Integer clubId;
    
    private Integer userId;
    
    private String type; // 收费类型
    
    private Double amount;
    
    private String description;
    
    private Integer status; // 0-待缴费 1-已缴费 2-逾期
    
    private Integer creatorId;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}