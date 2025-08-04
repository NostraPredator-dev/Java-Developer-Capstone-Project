// patientDashboard.js
import { createDoctorCard } from "./components/doctorCard.js";
import { openModal } from "./components/modals.js";
import { getDoctors, filterDoctors } from "./services/doctorServices.js";
import { patientLogin, patientSignup } from "./services/patientServices.js";

// Reference to the doctor cards container
const contentDiv = document.getElementById("content");

/* ---------------------------------------
   Load Doctor Cards on Page Load
---------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    loadDoctorCards();

    // Bind Signup button to open modal
    const signupBtn = document.getElementById("patientSignup");
    if (signupBtn) {
        signupBtn.addEventListener("click", () => openModal("patientSignup"));
    }

    // Bind Login button to open modal
    const loginBtn = document.getElementById("patientLogin");
    if (loginBtn) {
        loginBtn.addEventListener("click", () => openModal("patientLogin"));
    }

    // Bind search & filter events
    const searchBar = document.getElementById("searchBar");
    const filterTime = document.getElementById("filterTime");
    const filterSpecialty = document.getElementById("filterSpecialty");

    if (searchBar) searchBar.addEventListener("input", filterDoctorsOnChange);
    if (filterTime) filterTime.addEventListener("change", filterDoctorsOnChange);
    if (filterSpecialty) filterSpecialty.addEventListener("change", filterDoctorsOnChange);
});

/* ---------------------------------------
   Fetch and Render All Doctors
---------------------------------------- */
async function loadDoctorCards() {
    try {
        const doctors = await getDoctors();
        renderDoctorCards(doctors);
    } catch (err) {
        console.error("Error loading doctors:", err);
        contentDiv.innerHTML = `<p>Error loading doctors. Please try again later.</p>`;
    }
}

/* ---------------------------------------
   Filter Doctors on Search/Dropdown Change
---------------------------------------- */
async function filterDoctorsOnChange() {
    const name = document.getElementById("searchBar")?.value.trim() || "";
    const time = document.getElementById("filterTime")?.value || "";
    const specialty = document.getElementById("filterSpecialty")?.value || "";

    try {
        const doctors = await filterDoctors(name, time, specialty);
        if (doctors && doctors.length > 0) {
            renderDoctorCards(doctors);
        } else {
            contentDiv.innerHTML = `<p>No doctors found with the given filters.</p>`;
        }
    } catch (err) {
        console.error("Error filtering doctors:", err);
        contentDiv.innerHTML = `<p>Error filtering doctors. Please try again later.</p>`;
    }
}

/* ---------------------------------------
   Render Utility for Doctor Cards
---------------------------------------- */
function renderDoctorCards(doctors) {
    contentDiv.innerHTML = "";
    if (!doctors || doctors.length === 0) {
        contentDiv.innerHTML = `<p>No doctors available at the moment.</p>`;
        return;
    }

    doctors.forEach((doctor) => {
        const card = createDoctorCard(doctor);
        contentDiv.appendChild(card);
    });
}

/* ---------------------------------------
   Handle Patient Signup
---------------------------------------- */
window.signupPatient = async function () {
    const name = document.getElementById("signupName")?.value.trim();
    const email = document.getElementById("signupEmail")?.value.trim();
    const password = document.getElementById("signupPassword")?.value;
    const phone = document.getElementById("signupPhone")?.value.trim();
    const address = document.getElementById("signupAddress")?.value.trim();

    const data = { name, email, password, phone, address };

    try {
        const response = await patientSignup(data);
        if (response.success) {
            alert(response.message || "Signup successful! Please log in.");
            // Close modal (if modal close function exists)
            document.getElementById("patientSignupModal")?.classList.remove("open");
            location.reload();
        } else {
          alert(response.message || "Signup failed. Please try again.");
        }
    } catch (err) {
        console.error("Signup error:", err);
        alert("Signup failed. Please check your connection and try again.");
    }
};

/* ---------------------------------------
   Handle Patient Login
---------------------------------------- */
window.loginPatient = async function () {
    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;

    const data = { email, password };

    try {
        const response = await patientLogin(data);

        if (response.ok) {
            const json = await response.json();
            localStorage.setItem("token", json.token);
            localStorage.setItem("userRole", "loggedPatient");
            alert("Login successful!");
            window.location.href = "loggedPatientDashboard.html";
        } else {
          alert("Invalid credentials! Please try again.");
        }
    } catch (err) {
        console.error("Login error:", err);
        alert("Login failed. Please check your connection and try again.");
    }
};