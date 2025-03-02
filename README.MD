Backend Engineer (Infrastructure, API Engineer, Devops): Cowrywise.
https://coda.io/d/_deRE9tB1Cx_/Backend-Assessment_sui482LU

# Library Management System

This repository contains two independent API services for managing a library system:

1. **Frontend API** (Python/FastAPI)
2. **Backend/Admin API** (Express.js)

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Testing](#testing)

## Prerequisites

- Node.js (for Express.js)
- Python (for FastAPI)
- Docker

## Setup Instructions

1. Clone the repository:
   git clone https://github.com/ridbay/Library-Management-with-Python-and-Nodejs.git
2. Navigate to the respective project folders:
   cd library-management/python-project
   cd library-management/expressjs-project

## Running the Application

Use Docker Compose to start the services:
docker-compose up --build

## Testing

Run tests for each project:

- Python: `pytest`
- Express.js: `npm test`
