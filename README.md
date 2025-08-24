# Task Assignment System

This is a MERN-based backend for a task assignment system. It allows employers to create tasks, assign them to employees, and track their progress.

## Features

*   Role-based access control (Superadmin, Employer, Employee)
*   JWT-based authentication
*   Task management (Create, Read, Update, Delete)
*   Employee management
*   File uploads for tasks
*   Comments on tasks
*   Email notifications for new tasks and task completions

### Newly Implemented Features

#### 1. Activity Logging

A comprehensive activity logging system has been implemented. The following actions are now logged and can be retrieved for a specific task:
*   Task creation
*   Task status updates
*   New comments
*   File uploads

You can fetch the activity log for a task using the following API endpoint:

`GET /api/tasks/:taskId/activities`

This endpoint is protected and can only be accessed by the user who created the task or the employees assigned to it.

#### 2. Deadline Reminders

A system for sending email reminders for tasks with upcoming deadlines has been implemented. This is handled by a standalone script that can be run periodically (e.g., using a cron job).

To run the deadline checker manually, use the following command:

```bash
npm run check-deadlines
```

This script will:
1.  Find all non-completed tasks that are due within the next 24 hours.
2.  Send a reminder email to each assigned employee.
3.  Mark the task so that the reminder is not sent again, to avoid spamming users.

## Setup

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Create a `.env` file in the root directory with the following variables:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    JWT_LIFETIME=30d
    EMAIL_HOST=your_smtp_host
    EMAIL_PORT=your_smtp_port
    EMAIL_USER=your_smtp_user
    EMAIL_PASSWORD=your_smtp_password
    ```
4.  Run the application: `npm run dev`

## Available Scripts

*   `npm run dev`: Starts the development server with hot-reloading.
*   `npm run create-admin`: A script to create the initial superadmin user.
*   `npm run check-deadlines`: Runs the deadline reminder service.
