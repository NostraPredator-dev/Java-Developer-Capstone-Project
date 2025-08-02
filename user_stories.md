# User Stories

## Admin User Stories

### 1. Log in to the portal

**Title:**  
_As an admin, I want to log into the portal with my username and password, so that I can manage the platform securely._

**Acceptance Criteria:**

1. The portal should validate the admin credentials.  
2. Successful login should redirect to the admin dashboard.  
3. Invalid credentials should show an error message without logging in.

**Priority:** High  
**Story Points:** 3  
**Notes:**  

- Ensure encryption for password storage and secure authentication.

---

### 2. Log out of the portal

**Title:**  
_As an admin, I want to log out of the portal, so that I can protect system access._

**Acceptance Criteria:**  

1. Admin should be redirected to the login page after logout.  
2. Session data should be cleared from the browser.  
3. System should prevent accessing any protected page after logout.

**Priority:** Medium  
**Story Points:** 2  
**Notes:**  

- Implement session expiration for security.

---

### 3. Add doctors to the portal

**Title:**  
_As an admin, I want to add doctors to the portal, so that new doctors can manage appointments and patients can book them._

**Acceptance Criteria:**  

1. Admin can input doctor details like name, specialization, and contact info.  
2. Doctor account is created with a unique ID and login credentials.  
3. Success or error messages are displayed accordingly.

**Priority:** High  
**Story Points:** 5  
**Notes:**  

- Validate duplicate email and specialization fields.

---

### 4. Delete doctor profiles from the portal

**Title:**  
_As an admin, I want to delete a doctor’s profile from the portal, so that I can manage inactive or removed doctors._

**Acceptance Criteria:**  

1. Admin can search and select a doctor profile to delete.  
2. A confirmation prompt appears before deletion.  
3. Deleting the profile should remove login access for that doctor.

**Priority:** Medium  
**Story Points:** 3  
**Notes:**  

- Consider soft delete to maintain historical appointment data.

---

### 5. Run stored procedure for appointment statistics

**Title:**  
_As an admin, I want to run a stored procedure in MySQL CLI to get the number of appointments per month, so that I can track usage statistics._

**Acceptance Criteria:**  

1. Admin can execute the stored procedure from the database CLI.  
2. The result should display the count of appointments per month.  
3. Procedure execution errors should be logged.

**Priority:** Low  
**Story Points:** 2  
**Notes:**  

- Useful for monthly performance and analytics reporting.

---

## Patient User Stories

### 1. View a list of doctors without logging in

**Title:**  
_As a patient, I want to view a list of doctors without logging in, so that I can explore available options before registering._

**Acceptance Criteria:**  

1. Patients can access a public page listing all doctors.  
2. The list should include the doctor’s name, specialization, and availability.  
3. Patients cannot book without logging in.

**Priority:** Medium  
**Story Points:** 3  

---

### 2. Sign up to book appointments

**Title:**  
_As a patient, I want to sign up using my email and password, so that I can book appointments._

**Acceptance Criteria:**  

1. The system should create a new patient account upon valid sign-up.  
2. Duplicate email registration should not be allowed.  
3. On successful registration, the patient is prompted to log in.

**Priority:** High  
**Story Points:** 3  

---

### 3. Log into the portal

**Title:**  
_As a patient, I want to log into the portal, so that I can manage my bookings._

**Acceptance Criteria:**  

1. Valid credentials should redirect to the patient dashboard.  
2. Invalid credentials show an error message.  
3. Session should persist until logout or timeout.

**Priority:** High  
**Story Points:** 2  

---

### 4. Log out of the portal

**Title:**  
_As a patient, I want to log out of the portal, so that I can secure my account._

**Acceptance Criteria:**  

1. Redirect to the home/login page after logout.  
2. Session data should be cleared.  
3. Prevent access to protected pages post-logout.

**Priority:** Medium  
**Story Points:** 1  

---

### 5. Book an appointment

**Title:**  
_As a patient, I want to log in and book an hour-long appointment with a doctor, so that I can consult for my health concerns._

**Acceptance Criteria:**  

1. The patient can choose a doctor and available time slot.  
2. System should confirm the booking with a success message.  
3. Overlapping or unavailable slots should not be bookable.

**Priority:** High  
**Story Points:** 5  

---

### 6. View upcoming appointments

**Title:**  
_As a patient, I want to view my upcoming appointments, so that I can prepare accordingly._

**Acceptance Criteria:**  

1. Patient can see a list of future appointments with date, time, and doctor name.  
2. Past appointments should be excluded from the list.  
3. Data should update in real-time if a booking is canceled.

**Priority:** Medium  
**Story Points:** 2  

---

## Doctor User Stories

### 1. Log into the portal

**Title:**  
_As a doctor, I want to log into the portal, so that I can manage my appointments._

**Acceptance Criteria:**  

1. Doctor should access the portal with valid credentials.  
2. Redirect to doctor dashboard upon successful login.  
3. Invalid credentials show an error message.

**Priority:** High  
**Story Points:** 3  

---

### 2. LogOut of the portal

**Title:**  
_As a doctor, I want to log out of the portal, so that I can protect my data._

**Acceptance Criteria:**  

1. Doctor is redirected to the login page after logout.  
2. Session is cleared from the system.  
3. Doctor cannot access protected pages after logout.

**Priority:** Medium  
**Story Points:** 2  

---

### 3. View appointment calendar

**Title:**  
_As a doctor, I want to view my appointment calendar, so that I can stay organized._

**Acceptance Criteria:**  

1. Doctor can see a daily/weekly calendar of appointments.  
2. Past and upcoming appointments are clearly distinguished.  
3. Appointment details like patient name and time are visible.

**Priority:** High  
**Story Points:** 5  

---

### 4. Mark unavailability

**Title:**  
_As a doctor, I want to mark my unavailability, so that patients only see my available slots._

**Acceptance Criteria:**  

1. Doctor can block specific dates and time slots.  
2. Blocked slots are immediately reflected in the booking system.  
3. Patients cannot book during unavailable periods.

**Priority:** High  
**Story Points:** 3  

---

### 5. Update profile

**Title:**  
_As a doctor, I want to update my profile with specialization and contact information, so that patients have up-to-date information._

**Acceptance Criteria:**  

1. Doctor can update fields like phone number, email, specialization, and bio.  
2. Changes reflect immediately on the patient-facing portal.  
3. Profile update history is logged for auditing.

**Priority:** Medium  
**Story Points:** 3  

---

### 6. View patient details

**Title:**  
_As a doctor, I want to view the patient details for upcoming appointments, so that I can be prepared._

**Acceptance Criteria:**  

1. Doctor can access patient information like name, age, and reason for visit.  
2. Sensitive information is only accessible after login.  
3. Patient details load correctly in the appointment calendar.

**Priority:** High  
**Story Points:** 4  
