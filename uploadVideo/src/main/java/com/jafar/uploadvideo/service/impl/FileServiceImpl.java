package com.jafar.uploadvideo.service.impl;

import com.jafar.uploadvideo.dto.FileDto;
import com.jafar.uploadvideo.models.File;
import com.jafar.uploadvideo.repository.FileRepository;
import com.jafar.uploadvideo.service.FileService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileServiceImpl implements FileService {
    private final FileRepository fileRepository;

    public FileServiceImpl(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }


    @Override
    public List<FileDto> findAll() {
        var files = fileRepository.findAll();
        return files.stream().map(this::mapToFileDto).collect(Collectors.toList());
    }

    private FileDto mapToFileDto(File file) {
        return FileDto
                .builder()
                .id(file.getId())
                .name(file.getName())
                .build();
    }

    @Override
    public File addFile(File file) {
        return fileRepository.save(file);
    }
}
