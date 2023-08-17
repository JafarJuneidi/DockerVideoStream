package com.jafar.uploadvideo.controller;

import com.jafar.uploadvideo.dto.UserDto;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class AuthController {

    @GetMapping("/login")
    public String showLoginForm(Model model) {
        model.addAttribute("userDto", UserDto.builder().build());
        return "login";
    }

    @PostMapping("/login")
    public String processLogin(@ModelAttribute UserDto userDto, RedirectAttributes redirectAttributes) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserDto> request = new HttpEntity<>(userDto, headers);

        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(
                    "http://containerization-authentication-service-1:8080/api/v1/auth/authenticate",
                    HttpMethod.POST,
                    request,
                    String.class
            );

            String token = response.getBody();
            return "redirect:/upload";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Login failed. Something went wrong.");
        }
        return "redirect:/login";
    }

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("userDto", UserDto.builder().build());
        return "register";
    }

    @PostMapping("/register")
    public String processRegistration(@ModelAttribute UserDto userDto, RedirectAttributes redirectAttributes) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserDto> request = new HttpEntity<>(userDto, headers);

        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(
                    "http://containerization-authentication-service-1:8080/api/v1/auth/register",
                    HttpMethod.POST,
                    request,
                    String.class
            );

            String token = response.getBody();
            return "redirect:/upload";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Registration failed. Something went wrong.");
        }
        return "redirect:/register";
    }
}

