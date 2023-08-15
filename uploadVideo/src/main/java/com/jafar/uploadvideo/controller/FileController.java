package com.jafar.uploadvideo.controller;

import com.jafar.uploadvideo.dto.FileDto;
import com.jafar.uploadvideo.service.FileService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class FileController {
    private FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @GetMapping("/files")
    public String listFiles(Model model) {
        List<FileDto> files = fileService.findAll();
        model.addAttribute("files", files);
        return "files-list";
    }
}
