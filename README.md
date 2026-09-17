# COMPLAINO

A full-stack web application for students to report campus-related issues and for administrators to manage and track those reports.

## Overview

Complaino provides a structured platform for students to submit issues related to academics, infrastructure, hostel facilities, transportation, technology, cleanliness, and other campus concerns.

The application includes separate interfaces and permissions for students, council members, and administrators.

## Features

- Student registration and login
- Student account verification
- Secure authentication with JWT
- Password hashing with Argon2
- Issue reporting and tracking
- Unique request codes for submitted issues
- Issue categories and status management
- Role-based access control
- Council and administrator dashboards
- Protected routes
- Input validation
- Secure HTTP headers and CORS configuration

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- JWT
- Argon2
- Zod

## Project Structure

```text
campus-connect/
├── backend/
├── frontend/
├── .gitignore
└── README.md