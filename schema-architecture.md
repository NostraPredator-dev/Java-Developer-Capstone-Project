# Architecture Summary

The application follows a layered Spring Boot architecture combining both MVC and REST patterns to cater to different modules. Admin and Doctor dashboards are implemented using Thymeleaf-based MVC controllers, providing a dynamic and server-rendered interface, while RESTful controllers expose APIs for patient and external client interactions. All incoming requests flow through a centralized service layer, which encapsulates the business logic and delegates operations to the repository layer, ensuring a clean separation of concerns and maintainable code structure.

The system employs a dual-database architecture for optimized data management. MySQL serves as the primary relational database, storing structured entities such as patients, doctors, appointments, and admin records through Spring Data JPA, while MongoDB handles unstructured medical data, specifically prescriptions, using document models. This combination of MVC, REST, and dual-database integration ensures the application is scalable, modular, and well-suited for both web and API-driven interactions.

## Data Flow and Control

### User Interaction

The user accesses the application through either the Admin/Doctor dashboard (via browser) or patient-facing REST APIs (via client or mobile app).

### Controller Handling

The request is routed to the appropriate Thymeleaf MVC controller for dashboards or REST controller for API endpoints.

### Service Layer Invocation

The controller delegates the request to the centralized service layer, where all business logic is processed to determine the required operations.

### Repository Layer Access

Based on the request type, the service layer communicates with the repository layer to interact with the underlying databases.

### Database Operations

- MySQL (via JPA) handles structured data like patients, doctors, appointments, and admin records.
- MongoDB (via document models) stores and retrieves prescriptions and other unstructured medical data.

### Response Assembly

Data retrieved from the repositories is processed by the service layer, which prepares the response for either web rendering or API output.

### Response Delivery

- For dashboards, the MVC controller returns a Thymeleaf view populated with the requested data.
- For APIs, the REST controller returns JSON responses to the client.