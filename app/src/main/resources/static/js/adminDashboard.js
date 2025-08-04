/*
  This script handles the admin dashboard functionality for managing doctors:
  - Loads all doctor cards
  - Filters doctors by name, time, or specialty
  - Adds a new doctor via modal form


  Attach a click listener to the "Add Doctor" button
  When clicked, it opens a modal form using openModal('addDoctor')


  When the DOM is fully loaded:
    - Call loadDoctorCards() to fetch and display all doctors


  Function: loadDoctorCards
  Purpose: Fetch all doctors and display them as cards

    Call getDoctors() from the service layer
    Clear the current content area
    For each doctor returned:
    - Create a doctor card using createDoctorCard()
    - Append it to the content div

    Handle any fetch errors by logging them


  Attach 'input' and 'change' event listeners to the search bar and filter dropdowns
  On any input change, call filterDoctorsOnChange()


  Function: filterDoctorsOnChange
  Purpose: Filter doctors based on name, available time, and specialty

    Read values from the search bar and filters
    Normalize empty values to null
    Call filterDoctors(name, time, specialty) from the service

    If doctors are found:
    - Render them using createDoctorCard()
    If no doctors match the filter:
    - Show a message: "No doctors found with the given filters."

    Catch and display any errors with an alert


  Function: renderDoctorCards
  Purpose: A helper function to render a list of doctors passed to it

    Clear the content area
    Loop through the doctors and append each card to the content area


  Function: adminAddDoctor
  Purpose: Collect form data and add a new doctor to the system

    Collect input values from the modal form
    - Includes name, email, phone, password, specialty, and available times

    Retrieve the authentication token from localStorage
    - If no token is found, show an alert and stop execution

    Build a doctor object with the form values

    Call saveDoctor(doctor, token) from the service

    If save is successful:
    - Show a success message
    - Close the modal and reload the page

    If saving fails, show an error message
*/

import { openModal } from "./components/modals.js";
import { getDoctors, filterDoctors, saveDoctor } from "./services/doctorServices.js";
import { createDoctorCard } from "./components/doctorCard.js";

// Main content container
const contentDiv = document.getElementById("content");

// 1️⃣ Event Binding for Add Doctor Button
const addDocBtn = document.getElementById("addDocBtn");
if (addDocBtn) {
    addDocBtn.addEventListener("click", () => {
        openModal("addDoctor");
    });
}

// 2️⃣ Load Doctor Cards on Page Load
window.addEventListener("DOMContentLoaded", loadDoctorCards);

async function loadDoctorCards() {
    try {
        contentDiv.innerHTML = `<p>Loading doctors...</p>`;
        const doctors = await getDoctors();

        if (!doctors || doctors.length === 0) {
            contentDiv.innerHTML = `<p>No doctors found.</p>`;
            return;
        }

        renderDoctorCards(doctors);
    } catch (err) {
        console.error("Error loading doctor cards:", err);
        contentDiv.innerHTML = `<p>Error loading doctors. Try again later.</p>`;
    }
}

// Utility: Render Doctor Cards
function renderDoctorCards(doctors) {
    contentDiv.innerHTML = ""; // Clear old content
    doctors.forEach((doc) => {
        const card = createDoctorCard(doc);
        contentDiv.appendChild(card);
    });
}

// 3️⃣ Implement Search & Filter Logic
const searchBar = document.getElementById("searchBar");
const filterTime = document.getElementById("filterTime");
const filterSpecialty = document.getElementById("filterSpecialty");

if (searchBar) searchBar.addEventListener("input", filterDoctorsOnChange);
if (filterTime) filterTime.addEventListener("change", filterDoctorsOnChange);
if (filterSpecialty) filterSpecialty.addEventListener("change", filterDoctorsOnChange);

async function filterDoctorsOnChange() {
    const name = searchBar?.value.trim() || "";
    const time = filterTime?.value || "";
    const specialty = filterSpecialty?.value || "";

    try {
        const doctors = await filterDoctors(name, time, specialty);
        if (!doctors || doctors.length === 0) {
        contentDiv.innerHTML = `<p>No doctors found matching your criteria.</p>`;
        return;
        }

        renderDoctorCards(doctors);
    } catch (err) {
        console.error("Error filtering doctors:", err);
        contentDiv.innerHTML = `<p>Error filtering doctors. Please try again.</p>`;
    }
}

// 4️⃣ Handle Add Doctor Modal Submission
const addDoctorForm = document.getElementById("addDoctorForm");
if (addDoctorForm) {
    addDoctorForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await adminAddDoctor();
    });
}

async function adminAddDoctor() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Session expired. Please log in again.");
        window.location.href = "/";
        return;
    }

    // Collect data from form
    const name = document.getElementById("doctorName").value.trim();
    const specialty = document.getElementById("doctorSpecialty").value.trim();
    const email = document.getElementById("doctorEmail").value.trim();
    const password = document.getElementById("doctorPassword").value.trim();
    const mobile = document.getElementById("doctorMobile").value.trim();

    // Collect availability from checkboxes
    const availability = Array.from(
        document.querySelectorAll('input[name="availability"]:checked')
    ).map((cb) => cb.value);

    if (!name || !specialty || !email || !password || !mobile || availability.length === 0) {
        alert("Please fill all fields and select at least one availability.");
        return;
    }

    const doctorData = { name, specialty, email, password, mobile, availability };

    try {
        const response = await saveDoctor(doctorData, token);

        if (response.success) {
        alert("Doctor added successfully!");
        // Close modal programmatically (if openModal handles classes)
        const modal = document.getElementById("addDoctorModal");
        if (modal) modal.style.display = "none";

        // Reload doctors
        loadDoctorCards();
        } else {
           alert(response.message || "Failed to add doctor.");
        }
    } catch (err) {
        console.error("Error adding doctor:", err);
        alert("An error occurred while adding the doctor.");
    }
}