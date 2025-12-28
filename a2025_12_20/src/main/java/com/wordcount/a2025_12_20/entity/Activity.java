package com.wordcount.a2025_12_20.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("activity")
public class Activity implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Integer id;
    
    private Integer clubId;
    
    private String title;
    
    private String content;
    
    private String startTime;
    
    private String endTime;
    
    private String location;
    
    @TableField("max_participants")
    private Integer maxParticipants;
    
    @TableField("current_participants")
    private Integer currentParticipants;
    
    private Integer status; // 0-未开始 1-进行中 2-已结束 3-取消
    
    private Integer creatorId;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}