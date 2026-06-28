# OMS - Order Management System

**OMS (Order Management System)** is a web application designed to streamline the entire delivery process. The system allows businesses to efficiently manage incoming orders, track their status in real-time, and communicate updates to customers.

With OMS, administrators can oversee all aspects of order handling: accepting new orders, updating and reverting order statuses, managing documents and invoices, scheduling pickups with time slots, and sending email notifications automatically when the status changes. The application includes a secure admin panel with authentication to manage operations and ensure proper access control.

This system is built to simplify delivery management, improve transparency, and enhance customer satisfaction.

## Technologies Used

- **Frontend:** React with TypeScript
- **Backend:** Node.js (Express)
- **Database:** PostgreSQL (via Prisma ORM)
- **File Storage:** Cloudflare R2 (S3-compatible)
- **Other Features:** Email notifications, Time slot scheduling, Document management with invoice tracking

## Key Features

- Order creation with time slot selection (for Miele CZ/SK — Wednesday & Thursday)
- Real-time order status tracking (accepted → sent → delivered → paid)
- Status revert — ability to roll back an order to a previous status
- Document & invoice management with DPH calculation
- File uploads stored on Cloudflare R2
- Email notifications on order creation and delivery
- Secure admin panel with JWT authentication
- Order calendar view and filtering
