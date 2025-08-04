    package com.project.back_end.mvc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@Controller
public class DashboardController {

// 1. Set Up the MVC Controller Class:
//    - Annotate the class with `@Controller` to indicate that it serves as an MVC controller returning view names (not JSON).
//    - This class handles routing to admin and doctor dashboard pages based on token validation.


// 2. Autowire the Shared Service:
//    - Inject the common `Service` class, which provides the token validation logic used to authorize access to dashboards.


// 3. Define the `adminDashboard` Method:
//    - Handles HTTP GET requests to `/adminDashboard/{token}`.
//    - Accepts an admin's token as a path variable.
//    - Validates the token using the shared service for the `"admin"` role.
//    - If the token is valid (i.e., no errors returned), forwards the user to the `"admin/adminDashboard"` view.
//    - If invalid, redirects to the root URL, likely the login or home page.


// 4. Define the `doctorDashboard` Method:
//    - Handles HTTP GET requests to `/doctorDashboard/{token}`.
//    - Accepts a doctor's token as a path variable.
//    - Validates the token using the shared service for the `"doctor"` role.
//    - If the token is valid, forwards the user to the `"doctor/doctorDashboard"` view.
//    - If the token is invalid, redirects to the root URL.

    @Autowired
    private TokenValidationService tokenValidationService;

    /**
     * Admin dashboard access endpoint
     * Validates admin token and returns the Thymeleaf admin dashboard view.
     */
    @GetMapping("/adminDashboard/{token}")
    public String adminDashboard(@PathVariable String token) {
        // Validate the admin token
        Map<String, Object> validationResponse = tokenValidationService.validateToken(token, "admin");

        // If the response is empty → token is valid
        if (validationResponse.isEmpty()) {
            return "admin/adminDashboard"; 
            // Thymeleaf will resolve to src/main/resources/templates/admin/adminDashboard.html
        }

        // Invalid token → Redirect to login/home
        return "redirect:/";
    }

    /**
     * Doctor dashboard access endpoint
     * Validates doctor token and returns the Thymeleaf doctor dashboard view.
     */
    @GetMapping("/doctorDashboard/{token}")
    public String doctorDashboard(@PathVariable String token) {
        // Validate the doctor token
        Map<String, Object> validationResponse = tokenValidationService.validateToken(token, "doctor");

        // If the response is empty → token is valid
        if (validationResponse.isEmpty()) {
            return "doctor/doctorDashboard"; 
            // Resolves to src/main/resources/templates/doctor/doctorDashboard.html
        }

        // Invalid token → Redirect to login/home
        return "redirect:/";
    }
}