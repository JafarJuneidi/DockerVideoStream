package com.jafar.uploadvideo.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FileDto {
    private Integer id;
    private String name;
}
