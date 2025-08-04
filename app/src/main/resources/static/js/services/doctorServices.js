/*
  Import the base API URL from the config file
  Define a constant DOCTOR_API to hold the full endpoint for doctor-related actions


  Function: getDoctors
  Purpose: Fetch the list of all doctors from the API

   Use fetch() to send a GET request to the DOCTOR_API endpoint
   Convert the response to JSON
   Return the 'doctors' array from the response
   If there's an error (e.g., network issue), log it and return an empty array


  Function: deleteDoctor
  Purpose: Delete a specific doctor using their ID and an authentication token

   Use fetch() with the DELETE method
    - The URL includes the doctor ID and token as path parameters
   Convert the response to JSON
   Return an object with:
    - success: true if deletion was successful
    - message: message from the server
   If an error occurs, log it and return a default failure response


  Function: saveDoctor
  Purpose: Save (create) a new doctor using a POST request

   Use fetch() with the POST method
    - URL includes the token in the path
    - Set headers to specify JSON content type
    - Convert the doctor object to JSON in the request body

   Parse the JSON response and return:
    - success: whether the request succeeded
    - message: from the server

   Catch and log errors
    - Return a failure response if an error occurs


  Function: filterDoctors
  Purpose: Fetch doctors based on filtering criteria (name, time, and specialty)

   Use fetch() with the GET method
    - Include the name, time, and specialty as URL path parameters
   Check if the response is OK
    - If yes, parse and return the doctor data
    - If no, log the error and return an object with an empty 'doctors' array

   Catch any other errors, alert the user, and return a default empty result
*/

import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = API_BASE_URL + "/doctor";

/**
 * 1. Get all doctors
 * Used by Admin & Patient dashboards to display doctor cards.
 */
export async function getDoctors() {
    try {
        const res = await fetch(DOCTOR_API, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            console.error("Failed to fetch doctors:", res.status);
            return [];
        }

        const data = await res.json();
        return data || [];
    } catch (err) {
        console.error("Error fetching doctors:", err);
        return [];
    }
}

/**
 * 2. Delete doctor by ID
 * @param {string} id - Doctor's unique identifier
 * @param {string} token - Admin auth token
 */
export async function deleteDoctor(id, token) {
    try {
        const res = await fetch(`${DOCTOR_API}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        if (!res.ok) {
           return { success: false, message: data.message || "Failed to delete doctor" };
        }

        return { success: true, message: data.message || "Doctor deleted successfully" };
    } catch (err) {
        console.error("Error deleting doctor:", err);
        return { success: false, message: "Error occurred while deleting doctor" };
    }
}

/**
 * 3. Save (Add) a new doctor
 * @param {object} doctor - Doctor data {name, email, specialty, availability}
 * @param {string} token - Admin auth token
 */
export async function saveDoctor(doctor, token) {
    try {
        const res = await fetch(DOCTOR_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(doctor),
        });

        const data = await res.json();
            if (!res.ok) {
            return { success: false, message: data.message || "Failed to save doctor" };
        }

        return { success: true, message: data.message || "Doctor added successfully" };
    } catch (err) {
        console.error("Error saving doctor:", err);
        return { success: false, message: "Error occurred while saving doctor" };
    }
}

/**
 * 4. Filter doctors by name, time, and specialty
 * @param {string} name
 * @param {string} time
 * @param {string} specialty
 */
export async function filterDoctors(name = "", time = "", specialty = "") {
    try {
        // Build query params dynamically
        const params = new URLSearchParams();
        if (name) params.append("name", name);
        if (time) params.append("time", time);
        if (specialty) params.append("specialty", specialty);

        const res = await fetch(`${DOCTOR_API}/filter?${params.toString()}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            console.error("Failed to filter doctors:", res.status);
            return [];
        }

        const data = await res.json();
        return data || [];
    } catch (err) {
        console.error("Error filtering doctors:", err);
        return [];
    }
}