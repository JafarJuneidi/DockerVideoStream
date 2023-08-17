package com.jafar.uploadvideo.service;

import com.jafar.uploadvideo.dto.FileDto;
import com.jafar.uploadvideo.models.File;

import java.util.List;

public interface FileService {
    List<FileDto> findAll();
    File addFile(File file);
}
