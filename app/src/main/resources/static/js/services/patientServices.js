import { API_BASE_URL } from "../config/config.js";

// Base endpoint for all patient-related API requests
const PATIENT_API = API_BASE_URL + "/patient";

/**
 * 1. Handle Patient Signup
 * @param {Object} data - Patient details {name, email, password, phone, ...}
 * @returns {Object} { success: boolean, message: string }
 */
export async function patientSignup(data) {
    try {
        const res = await fetch(`${PATIENT_API}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const responseData = await res.json();
        if (!res.ok) {
          return { success: false, message: responseData.message || "Signup failed" };
        }

        return { success: true, message: responseData.message || "Signup successful" };
    } catch (err) {
        console.error("Error during patient signup:", err);
        return { success: false, message: "Network or server error occurred" };
    }
}

/**
 * 2. Handle Patient Login
 * @param {Object} data - Login credentials { email, password }
 * @returns {Object} { success: boolean, message: string, token?: string }
 */
export async function patientLogin(data) {
    try {
        const res = await fetch(`${PATIENT_API}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const responseData = await res.json();
        if (!res.ok) {
          return { success: false, message: responseData.message || "Invalid credentials" };
        }

        // Successful login: return token
        return {
            success: true,
            message: responseData.message || "Login successful",
            token: responseData.token,
        };
    } catch (err) {
        console.error("Error during patient login:", err);
        return { success: false, message: "Network or server error occurred" };
    }
}

/**
 * 3. Fetch Logged-in Patient Data
 * @param {string} token - Auth token from localStorage
 * @returns {Object|null} - Patient object or null if failed
 */
export async function getPatientData(token) {
    try {
        const res = await fetch(`${PATIENT_API}/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            console.error("Failed to fetch patient data:", res.status);
            return null;
        }

        const patientData = await res.json();
        return patientData || null;
    } catch (err) {
        console.error("Error fetching patient data:", err);
        return null;
    }
}

/**
 * 4. Fetch Patient Appointments
 * @param {string} id - Patient ID
 * @param {string} token - Auth token
 * @param {string} user - Who is requesting ("patient" or "doctor")
 * @returns {Array|null} - Array of appointments or null on failure
 */
export async function getPatientAppointments(id, token, user) {
    try {
        const res = await fetch(`${PATIENT_API}/${user}/${id}/appointments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            console.error("Failed to fetch patient appointments:", res.status);
            return null;
        }

        const appointments = await res.json();
        return appointments || [];
    } catch (err) {
        console.error("Error fetching patient appointments:", err);
        return null;
    }
}

/**
 * 5. Filter Appointments
 * @param {string} condition - e.g. "pending", "consulted"
 * @param {string} name - Patient name for filtering
 * @param {string} token - Auth token
 * @returns {Array} - Filtered appointments
 */
export async function filterAppointments(condition = "", name = "", token) {
    try {
        const params = new URLSearchParams();
        if (condition) params.append("condition", condition);
        if (name) params.append("name", name);

        const res = await fetch(`${PATIENT_API}/appointments/filter?${params.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            console.error("Failed to filter appointments:", res.status);
            return [];
        }

        const filteredAppointments = await res.json();
        return filteredAppointments || [];
    } catch (err) {
        console.error("Error filtering appointments:", err);
        return [];
    }
}