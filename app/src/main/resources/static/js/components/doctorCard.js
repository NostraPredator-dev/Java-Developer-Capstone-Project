/*
Import the overlay function for booking appointments from loggedPatient.js

  Import the deleteDoctor API function to remove doctors (admin role) from docotrServices.js

  Import function to fetch patient details (used during booking) from patientServices.js

  Function to create and return a DOM element for a single doctor card
    Create the main container for the doctor card
    Retrieve the current user role from localStorage
    Create a div to hold doctor information
    Create and set the doctor’s name
    Create and set the doctor's specialization
    Create and set the doctor's email
    Create and list available appointment times
    Append all info elements to the doctor info container
    Create a container for card action buttons
    === ADMIN ROLE ACTIONS ===
      Create a delete button
      Add click handler for delete button
     Get the admin token from localStorage
        Call API to delete the doctor
        Show result and remove card if successful
      Add delete button to actions container
   
    === PATIENT (NOT LOGGED-IN) ROLE ACTIONS ===
      Create a book now button
      Alert patient to log in before booking
      Add button to actions container
  
    === LOGGED-IN PATIENT ROLE ACTIONS === 
      Create a book now button
      Handle booking logic for logged-in patient   
        Redirect if token not available
        Fetch patient data with token
        Show booking overlay UI with doctor and patient info
      Add button to actions container
   
  Append doctor info and action buttons to the car
  Return the complete doctor card element
*/

// Named export so it can be imported in adminDashboard.js or patientDashboard.js
export function createDoctorCard(doctor) {
    // 1. Main Card Container
    const card = document.createElement("div");
    card.classList.add("doctor-card");

    // 2. Fetch current user's role
    const role = localStorage.getItem("userRole");

    // 3. Doctor Info Section
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("doctor-info");

    const name = document.createElement("h3");
    name.textContent = doctor.name || "Unnamed Doctor";

    const specialization = document.createElement("p");
    specialization.textContent = `Specialty: ${doctor.specialty || "N/A"}`;

    const email = document.createElement("p");
    email.textContent = `Email: ${doctor.email || "Not Provided"}`;

    const availability = document.createElement("p");
    availability.textContent = `Available: ${doctor.availability ? doctor.availability.join(", ") : "N/A"}`;

    infoDiv.appendChild(name);
    infoDiv.appendChild(specialization);
    infoDiv.appendChild(email);
    infoDiv.appendChild(availability);

    // 4. Button Container
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("card-actions");

    // 5. Conditionally Add Buttons Based on Role

    // ADMIN → Delete Doctor
    if (role === "admin") {
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Delete";
        removeBtn.classList.add("delete-btn");

        removeBtn.addEventListener("click", async () => {
            const confirmDelete = confirm(`Are you sure you want to delete Dr. ${doctor.name}?`);
            if (!confirmDelete) return;

            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`/api/doctors/${doctor.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                alert(`Doctor ${doctor.name} deleted successfully.`);
                card.remove(); // remove from DOM
                } else {
                alert("Failed to delete doctor.");
                }
            } catch (err) {
                console.error(err);
                alert("An error occurred while deleting doctor.");
            }
        });

        actionsDiv.appendChild(removeBtn);
    }

    // PATIENT (not logged in) → Book Now (login alert)
    else if (role === "patient") {
        const bookNow = document.createElement("button");
        bookNow.textContent = "Book Now";
        bookNow.classList.add("book-btn");

        bookNow.addEventListener("click", () => {
           alert("Please log in first to book an appointment.");
        });

        actionsDiv.appendChild(bookNow);
    }

    // LOGGED-IN PATIENT → Book Now (actual booking)
    else if (role === "loggedPatient") {
        const bookNow = document.createElement("button");
        bookNow.textContent = "Book Now";
        bookNow.classList.add("book-btn");

        bookNow.addEventListener("click", async (e) => {
        const token = localStorage.getItem("token");
        try {
            // Fetch patient data
            const patientData = await getPatientData(token);

            // Trigger booking overlay or modal
            showBookingOverlay(e, doctor, patientData);
        } catch (err) {
            console.error(err);
            alert("Unable to fetch patient data. Please try again.");
        }
        });

        actionsDiv.appendChild(bookNow);
    }

    // 6. Final Assembly
    card.appendChild(infoDiv);
    card.appendChild(actionsDiv);

    return card;
}

/**
 * Dummy function placeholders:
 * Replace these with actual implementations in your project.
 */
async function getPatientData(token) {
    const res = await fetch("/api/patient/me", {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch patient data");
    return await res.json();
}

function showBookingOverlay(event, doctor, patientData) {
    // Trigger modal or bottom popup
    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modal-body");
    if (modal && modalBody) {
        modalBody.innerHTML = `
            <h3>Book Appointment with Dr. ${doctor.name}</h3>
            <p>Specialty: ${doctor.specialty}</p>
            <p>Patient: ${patientData.name}</p>
            <button onclick="alert('Booking confirmed!')">Confirm Booking</button>
        `;
        modal.style.display = "block";
    }
}