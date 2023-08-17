package com.jafar.uploadvideo.controller;

import com.jafar.uploadvideo.dto.FileDto;
import com.jafar.uploadvideo.models.File;
import com.jafar.uploadvideo.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

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

    @GetMapping("/upload")
    public String displayUploadForm() {
        return "uploadVideo";  // Assuming the HTML provided is named 'uploadVideo.html'
    }

    @PostMapping("/upload")
    public String handleFileUpload(@RequestParam("file") MultipartFile file, Model model) {
        if (file.isEmpty()) {
            model.addAttribute("responseMessage", "No file selected. Please choose a video to upload.");
            return "uploadVideo";
        }

        File createdFile = File.builder().name(file.getOriginalFilename()).build();
        fileService.addFile(createdFile);

        try {
            // Set up headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // Set up the request body
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", file.getResource());

            // Create the request entity
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Create an instance of RestTemplate and send the request
            RestTemplate restTemplate = new RestTemplate();
            String expressServerUrl = "http://containerization-file-system-service-1:3000/upload";
            String response = restTemplate.postForObject(expressServerUrl, requestEntity, String.class);

            System.out.println(response);
            if (response != null && !response.isEmpty()) {
                model.addAttribute("responseMessage", "You successfully uploaded " + file.getOriginalFilename() + " to the external server!");
            } else {
                model.addAttribute("responseMessage", "Failed to upload the file to the external server!");
            }
        } catch (Exception e) {
            model.addAttribute("responseMessage", "Error occurred while uploading the file to the external server: " + e.getMessage());
        }
        return "uploadVideo";
    }
}
