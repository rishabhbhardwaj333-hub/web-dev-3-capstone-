# E-Commerce and Inventory Management System
## Backend Development Capstone Project Report

**Project Option:** Project 4 – E-Commerce and Inventory Management System  
**Technology:** Node.js, Express.js, MongoDB, Mongoose  
**Student / Team Details:** Add your name, roll number, course, faculty and team members before submission.

## 1. Abstract
The project implements a RESTful e-commerce backend for customers, sellers and administrators. Customers can browse products, manage a cart and place orders. Sellers manage their product listings and inventory, while administrators manage categories and oversee reports. The backend uses MongoDB for persistent storage, Mongoose for data modelling, JWT for authentication, bcrypt for password hashing and Socket.IO for real-time notifications.

## 2. Problem Statement
An e-commerce application needs reliable product, cart, order and inventory workflows. Incorrect stock updates, trusting client-submitted prices and weak access control can cause overselling, incorrect totals and unauthorized data access. This project addresses these issues through server-side validation, role-based access, database-backed operations and reporting.

## 3. Objectives
- Implement customer, seller and administrator roles.
- Develop REST APIs for authentication, products, categories, carts and orders.
- Maintain accurate stock during checkout and cancellation.
- Secure passwords and APIs using bcrypt, JWT and RBAC.
- Generate inventory and sales analytics using aggregation pipelines.
- Deliver order and low-stock notifications using EventEmitter and Socket.IO.

## 4. Scope and Limitations
The project covers catalogue browsing, category administration, cart management, order placement, seller order updates, stock management and reports. Payment is simulated for academic demonstration; no real card or banking information is processed. A frontend and production payment gateway are outside this backend implementation.

## 5. Functional and Non-Functional Requirements
Functional: registration/login/logout, token refresh, product CRUD, category management, search/filter/sort/pagination, cart operations, checkout, order history/status, cancellation, low-stock and sales reports, real-time notifications.  
Non-functional: secure password storage, role-based authorization, validation, consistent JSON errors, maintainable modular code and database persistence.

## 6. Architecture
The application follows a layered structure: Express routes receive HTTP requests, authentication/role middleware checks access, route handlers apply business logic, Mongoose models communicate with MongoDB, and JSON responses are returned. EventEmitter decouples internal business events from Socket.IO notification delivery.

## 7. Database Design
- **User:** name, email, password hash, role, refresh-token hash and active state.
- **Category:** unique name and description.
- **Product:** name, description, price, category reference, seller reference, stock, threshold, SKU and active state.
- **Cart:** unique customer reference and product/quantity items.
- **Order:** customer, product snapshots, seller references, quantities, total, delivery address, status and simulated payment state.

Relationships: a seller owns many products; a category contains many products; a customer has one cart and many orders; each order contains product snapshots and seller references.

Indexes are defined for unique emails, categories and SKUs; product text search and category/price; cart customer; and order customer/date and seller/status.

## 8. REST API Documentation
See `README.md` for the complete endpoint table, roles, example request bodies and setup. All protected endpoints use `Authorization: Bearer <accessToken>`.

## 9. Authentication and Authorization
Passwords are hashed using bcryptjs. Login issues a short-lived JWT access token and refresh token. Refresh tokens are rotated and only their SHA-256 hash is stored. Middleware validates access tokens and role permissions. Customers can access only their own cart/orders; sellers can update only their own products and relevant orders; category administration is restricted to admins.

## 10. Implementation Details
The application uses Node.js and Express, Mongoose models, dotenv configuration, centralized error middleware and modular routes. Checkout recalculates prices from the database and performs conditional stock decrements in a MongoDB transaction. Cancellation restores stock. Order status transitions are validated on the server. Payment status is marked as simulated.

## 11. Testing Strategy and Test Cases
Run the server and seed script, then execute the Postman checklist in README. Capture evidence for valid requests, invalid input, missing resources, missing/invalid tokens, insufficient roles, duplicate SKU, insufficient stock and invalid order status transitions. Add actual request/response screenshots and dates after testing.

## 12. Screenshots / Demonstration Evidence
**To be completed after local execution.** Insert screenshots of server startup, login, product listing, cart, checkout, stock update, low-stock report, sales report and Socket.IO notification. Do not use sample/mock screenshots as proof of execution.

## 13. Conclusion
The project demonstrates backend development concepts including REST API design, MVC-style separation, MongoDB data modelling, validation, authentication, authorization, aggregation, indexing, middleware, EventEmitter and Socket.IO. It provides a foundation that can be extended with a frontend, real payment provider, automated tests and deployment.

## 14. Future Enhancements
- Integrate a genuine payment gateway with secure provider-hosted checkout.
- Add automated integration tests and API rate limiting.
- Add product reviews, coupons and wishlists.
- Add audit logs and advanced seller analytics.
- Deploy with managed MongoDB and secure production secrets.

## 15. References
- Node.js documentation: https://nodejs.org/docs/
- Express documentation: https://expressjs.com/
- MongoDB documentation: https://www.mongodb.com/docs/
- Mongoose documentation: https://mongoosejs.com/docs/
- Socket.IO documentation: https://socket.io/docs/
