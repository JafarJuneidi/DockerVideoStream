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
        // Setup request headers, e.g., Content-Type header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserDto> request = new HttpEntity<>(userDto, headers);

        // Make the POST request
        // Create an instance of RestTemplate and send the request
        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(
                    "http://containerization-authentication-service-1:8080/api/v1/auth/login",
                    HttpMethod.POST,
                    request,
                    String.class
            );

            // Extract the token from the response, if needed
            String token = response.getBody();
            // Assuming you'll want to save the token or use it in some manner
            // Save it to session, database, etc. depending on your application's needs
            return "redirect:/upload";  // Redirect to upload page after successful authentication
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Login failed. Something went wrong.");
        }
        return "redirect:/login";  // Redirect back to registration page with an error message
    }

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("userDto", UserDto.builder().build());
        return "register";
    }

    @PostMapping("/register")
    public String processRegistration(@ModelAttribute UserDto userDto, RedirectAttributes redirectAttributes) {
        // Setup request headers, e.g., Content-Type header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserDto> request = new HttpEntity<>(userDto, headers);

        // Make the POST request
        // Create an instance of RestTemplate and send the request
        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(
                    "http://containerization-authentication-service-1:8080/api/v1/auth/authenticate",
                    HttpMethod.POST,
                    request,
                    String.class
            );

            // Extract the token from the response, if needed
            String token = response.getBody();
            // Assuming you'll want to save the token or use it in some manner
            // Save it to session, database, etc. depending on your application's needs
            return "redirect:/upload";  // Redirect to upload page after successful authentication
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Registration failed. Something went wrong.");
        }
        return "redirect:/register";  // Redirect back to registration page with an error message
    }
}

