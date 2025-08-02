# Database Design

## MySQL Database Design

### Table: Patients

- patient_id: INT, Primary Key, AUTO_INCREMENT
- first_name: VARCHAR(50), NOT NULL
- last_name: VARCHAR(50), NOT NULL
- date_of_birth: DATE, NOT NULL
- gender: ENUM('Male','Female','Other'), NOT NULL
- email: VARCHAR(100), UNIQUE
- phone: VARCHAR(15), NOT NULL
- address: TEXT
- created_at: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

Notes:

- Email and phone should be validated in the application layer.
- Deleting a patient should cascade delete their appointments if they have no historical/legal retention requirement.

### Table: Doctors

- doctor_id: INT, Primary Key, AUTO_INCREMENT
- first_name: VARCHAR(50), NOT NULL
- last_name: VARCHAR(50), NOT NULL
- specialization: VARCHAR(100), NOT NULL
- email: VARCHAR(100), UNIQUE
- phone: VARCHAR(15)
- clinic_location_id: INT, Foreign Key → clinic_locations(location_id)
- available_from: TIME
- available_to: TIME

Notes:

- Availability fields help avoid overlapping appointments.
- If a doctor is deleted, existing appointments can either be reassigned or canceled.

### Table: Appointments

- appointment_id: INT, Primary Key, AUTO_INCREMENT
- patient_id: INT, Foreign Key → patients(patient_id) ON DELETE CASCADE
- doctor_id: INT, Foreign Key → doctors(doctor_id)
- appointment_time: DATETIME, NOT NULL
- status: ENUM('Scheduled','Completed','Cancelled'), DEFAULT 'Scheduled'
- created_at: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

Notes:

- ON DELETE CASCADE ensures old appointments are removed when a patient is removed.
- No overlapping appointments for the same doctor at the same time can be enforced by a UNIQUE(doctor_id, appointment_time) constraint.

### Table: Admins

- admin_id: INT, Primary Key, AUTO_INCREMENT
- username: VARCHAR(50), UNIQUE, NOT NULL
- password_hash: VARCHAR(255), NOT NULL
- email: VARCHAR(100), UNIQUE
- role: ENUM('SuperAdmin','Manager','Staff'), DEFAULT 'Staff'
- created_at: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

### Table: Clinic Locations

- location_id: INT, Primary Key, AUTO_INCREMENT
- name: VARCHAR(100), NOT NULL
- address: TEXT, NOT NULL
- phone: VARCHAR(15)

Notes:

- Each doctor belongs to one clinic location.
- Useful for multi-branch clinics.

## MongoDB Collection Design

### Collection: Prescriptions

{
    "_id": { "$oid": "64fabc1234567890abcdef12" },
    "appointmentId": 101,
    "patientId": 12,
    "doctorId": 5,
    "medications": [
        { "name": "Paracetamol", "dosage": "500mg", "frequency": "1 tablet every 6 hours" },
        { "name": "Cough Syrup", "dosage": "10ml", "frequency": "Twice a day" }
    ],
    "doctorNotes": "Patient should rest for 3 days. Follow up if fever persists.",
    "attachments": [
        {
        "fileName": "blood_test_report.pdf",
        "fileUrl": "https://clinic-storage/reports/12_101.pdf"
        }
    ],
    "tags": ["fever", "viral"],
    "createdAt": { "$date": "2025-08-02T10:00:00Z" }
}
