/*
  Import the openModal function to handle showing login popups/modals
  Import the base API URL from the config file
  Define constants for the admin and doctor login API endpoints using the base URL

  Use the window.onload event to ensure DOM elements are available after page load
  Inside this function:
    - Select the "adminLogin" and "doctorLogin" buttons using getElementById
    - If the admin login button exists:
        - Add a click event listener that calls openModal('adminLogin') to show the admin login modal
    - If the doctor login button exists:
        - Add a click event listener that calls openModal('doctorLogin') to show the doctor login modal


  Define a function named adminLoginHandler on the global window object
  This function will be triggered when the admin submits their login credentials

  Step 1: Get the entered username and password from the input fields
  Step 2: Create an admin object with these credentials

  Step 3: Use fetch() to send a POST request to the ADMIN_API endpoint
    - Set method to POST
    - Add headers with 'Content-Type: application/json'
    - Convert the admin object to JSON and send in the body

  Step 4: If the response is successful:
    - Parse the JSON response to get the token
    - Store the token in localStorage
    - Call selectRole('admin') to proceed with admin-specific behavior

  Step 5: If login fails or credentials are invalid:
    - Show an alert with an error message

  Step 6: Wrap everything in a try-catch to handle network or server errors
    - Show a generic error message if something goes wrong


  Define a function named doctorLoginHandler on the global window object
  This function will be triggered when a doctor submits their login credentials

  Step 1: Get the entered email and password from the input fields
  Step 2: Create a doctor object with these credentials

  Step 3: Use fetch() to send a POST request to the DOCTOR_API endpoint
    - Include headers and request body similar to admin login

  Step 4: If login is successful:
    - Parse the JSON response to get the token
    - Store the token in localStorage
    - Call selectRole('doctor') to proceed with doctor-specific behavior

  Step 5: If login fails:
    - Show an alert for invalid credentials

  Step 6: Wrap in a try-catch block to handle errors gracefully
    - Log the error to the console
    - Show a generic error message
*/

// 1. Import required modules
import { openModal } from "../components/modals.js";
import { API_BASE_URL } from "../config/config.js";

// 2. Define endpoint constants
const ADMIN_API = API_BASE_URL + "/admin";
const DOCTOR_API = API_BASE_URL + "/doctor/login";

// 3. Setup button event listeners after DOM is fully loaded
window.onload = function () {
    const adminBtn = document.getElementById("adminLogin");
    const doctorBtn = document.getElementById("doctorLogin");

    // Admin button opens admin login modal
    if (adminBtn) {
        adminBtn.addEventListener("click", () => {
           openModal("adminLogin");
        });
    }

    // Doctor button opens doctor login modal
    if (doctorBtn) {
        doctorBtn.addEventListener("click", () => {
            openModal("doctorLogin");
        });
    }
};

/**
 * 4. Admin Login Handler
 * Triggered by the Admin login modal submit button
 */
export async function adminLoginHandler() {
    try {
        const username = document.getElementById("adminUsername").value.trim();
        const password = document.getElementById("adminPassword").value.trim();

        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        const admin = { username, password };

        const res = await fetch(ADMIN_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(admin),
        });

        if (!res.ok) {
            alert("Invalid credentials!");
            return;
        }

        const data = await res.json();
        localStorage.setItem("token", data.token);
        selectRole("admin"); // helper function from render.js

        alert("Admin login successful!");
        window.location.href = "/admin/adminDashboard.html"; // redirect to admin dashboard
    } catch (err) {
        console.error("Admin login error:", err);
        alert("An error occurred. Please try again later.");
    }
}

/**
 * 5. Doctor Login Handler
 * Triggered by the Doctor login modal submit button
 */
export async function doctorLoginHandler() {
    try {
        const email = document.getElementById("doctorEmail").value.trim();
        const password = document.getElementById("doctorPassword").value.trim();

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        const doctor = { email, password };

        const res = await fetch(DOCTOR_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(doctor),
        });

        if (!res.ok) {
            alert("Invalid credentials!");
            return;
        }

        const data = await res.json();
        localStorage.setItem("token", data.token);
        selectRole("doctor"); // helper function from render.js

        alert("Doctor login successful!");
        window.location.href = "/doctor/doctorDashboard.html"; // redirect to doctor dashboard
    } catch (err) {
        console.error("Doctor login error:", err);
        alert("An error occurred. Please try again later.");
    }
}