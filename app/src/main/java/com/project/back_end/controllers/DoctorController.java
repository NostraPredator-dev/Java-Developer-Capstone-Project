package com.project.back_end.controllers;

import com.project.back_end.models.Doctor;
import com.project.back_end.services.DoctorService;
import com.project.back_end.services.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.path}doctor")
public class DoctorController {
    // 1. Set Up the Controller Class:
    //    - Annotate the class with `@RestController` to define it as a REST controller that serves JSON responses.
    //    - Use `@RequestMapping("${api.path}doctor")` to prefix all endpoints with a configurable API path followed by "doctor".
    //    - This class manages doctor-related functionalities such as registration, login, updates, and availability.


    // 2. Autowire Dependencies:
    //    - Inject `DoctorService` for handling the core logic related to doctors (e.g., CRUD operations, authentication).
    //    - Inject the shared `Service` class for general-purpose features like token validation and filtering.


    // 3. Define the `getDoctorAvailability` Method:
    //    - Handles HTTP GET requests to check a specific doctor’s availability on a given date.
    //    - Requires `user` type, `doctorId`, `date`, and `token` as path variables.
    //    - First validates the token against the user type.
    //    - If the token is invalid, returns an error response; otherwise, returns the availability status for the doctor.


    // 4. Define the `getDoctor` Method:
    //    - Handles HTTP GET requests to retrieve a list of all doctors.
    //    - Returns the list within a response map under the key `"doctors"` with HTTP 200 OK status.


    // 5. Define the `saveDoctor` Method:
    //    - Handles HTTP POST requests to register a new doctor.
    //    - Accepts a validated `Doctor` object in the request body and a token for authorization.
    //    - Validates the token for the `"admin"` role before proceeding.
    //    - If the doctor already exists, returns a conflict response; otherwise, adds the doctor and returns a success message.


    // 6. Define the `doctorLogin` Method:
    //    - Handles HTTP POST requests for doctor login.
    //    - Accepts a validated `Login` DTO containing credentials.
    //    - Delegates authentication to the `DoctorService` and returns login status and token information.


    // 7. Define the `updateDoctor` Method:
    //    - Handles HTTP PUT requests to update an existing doctor's information.
    //    - Accepts a validated `Doctor` object and a token for authorization.
    //    - Token must belong to an `"admin"`.
    //    - If the doctor exists, updates the record and returns success; otherwise, returns not found or error messages.


    // 8. Define the `deleteDoctor` Method:
    //    - Handles HTTP DELETE requests to remove a doctor by ID.
    //    - Requires both doctor ID and an admin token as path variables.
    //    - If the doctor exists, deletes the record and returns a success message; otherwise, responds with a not found or error message.


    // 9. Define the `filter` Method:
    //    - Handles HTTP GET requests to filter doctors based on name, time, and specialty.
    //    - Accepts `name`, `time`, and `speciality` as path variables.
    //    - Calls the shared `Service` to perform filtering logic and returns matching doctors in the response.

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private TokenService tokenService; // Handles token validation & filtering

    /**
     * 1. Get Doctor Availability
     */
    @GetMapping("/availability/{user}/{doctorId}/{date}/{token}")
    public ResponseEntity<?> getDoctorAvailability(@PathVariable String user,
                                                   @PathVariable Long doctorId,
                                                   @PathVariable String date,
                                                   @PathVariable String token) {
        // Validate token for the given role
        if (!tokenService.validateToken(token, user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or unauthorized token."));
        }

        List<String> availability = doctorService.getDoctorAvailability(doctorId, LocalDate.parse(date));
        return ResponseEntity.ok(Map.of("availability", availability));
    }

    /**
     * 2. Get List of Doctors
     */
    @GetMapping
    public ResponseEntity<?> getDoctors() {
        List<Doctor> doctors = doctorService.getDoctors();
        return ResponseEntity.ok(Map.of("doctors", doctors));
    }

    /**
     * 3. Add New Doctor (Admin Only)
     */
    @PostMapping("/{token}")
    public ResponseEntity<?> addDoctor(@PathVariable String token,
                                       @RequestBody Doctor doctor) {
        if (!tokenService.validateToken(token, "admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or unauthorized token."));
        }

        int status = doctorService.saveDoctor(doctor);
        switch (status) {
            case 1:
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(Map.of("message", "Doctor added to db"));
            case 2:
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Doctor already exists"));
            default:
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Some internal error occurred"));
        }
    }

    /**
     * 4. Doctor Login
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> doctorLogin(@RequestBody Map<String, String> login) {
        // login contains "email" and "password"
        return doctorService.validateDoctor(login);
    }

    /**
     * 5. Update Doctor Details (Admin Only)
     */
    @PutMapping("/{token}")
    public ResponseEntity<?> updateDoctor(@PathVariable String token,
                                          @RequestBody Doctor doctor) {
        if (!tokenService.validateToken(token, "admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or unauthorized token."));
        }

        int status = doctorService.updateDoctor(doctor);
        switch (status) {
            case 1:
                return ResponseEntity.ok(Map.of("message", "Doctor updated"));
            case 2:
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Doctor not found"));
            default:
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Some internal error occurred"));
        }
    }

    /**
     * 6. Delete Doctor (Admin Only)
     */
    @DeleteMapping("/{id}/{token}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id,
                                          @PathVariable String token) {
        if (!tokenService.validateToken(token, "admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or unauthorized token."));
        }

        int status = doctorService.deleteDoctor(id);
        switch (status) {
            case 1:
                return ResponseEntity.ok(Map.of("message", "Doctor deleted successfully"));
            case 2:
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Doctor not found with id"));
            default:
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Some internal error occurred"));
        }
    }

    /**
     * 7. Filter Doctors
     */
    @GetMapping("/filter/{name}/{time}/{speciality}")
    public ResponseEntity<?> filterDoctors(@PathVariable String name,
                                           @PathVariable String time,
                                           @PathVariable String speciality) {
        List<Doctor> filteredDoctors = tokenService.filterDoctor(name, time, speciality);
        return ResponseEntity.ok(Map.of("filteredDoctors", filteredDoctors));
    }
}