book-app

Full-stack modular book management platform built with .NET Core, React and Docker.
Designed with scalability, extensibility and clean architecture principles.

🚀 Project Overview

book-app simulates a production-oriented book management platform.
The goal of this project is to design and implement a scalable full-stack application from scratch, with a strong focus on:
Clean backend architecture
Modular REST API design
Separation of concerns
Multi-source extensibility
Real-world use case simulation (users, roles, books, preferences, translations)
This project emphasizes engineering practices rather than simple feature implementation.

🏗 Architecture

Backend — .NET Core API

50+ modular REST controllers
Entity Framework Core with Fluent API
Complex relational data model
Filtered indexes and composite keys
Separation of controllers, services and data layer
Email validation workflow (token-based)
Primary database: SQL Server
Multi-source architecture is partially prepared for future integration (Strapi / MongoDB).

Frontend — React (Next.js)

Redux Toolkit state management
AES response decryption layer
Modular feature-based architecture
i18n system with regional variants
Structured components and hooks organization

CMS — Strapi v5 (TypeScript)

Secondary content source (partially integrated)
Custom routes and services
PostgreSQL database

Infrastructure

Fully dockerized environment
docker-compose orchestration
SQL Server + PostgreSQL containers
Backend + Frontend containers
Script-based initialization

🧩 Key Features

Complete authentication system
Token-based email validation
CRUD operations for books and related entities
Modular and extensible backend design
Multi-language frontend structure
Role-oriented system foundation
Production-oriented project structure

⚙️ Tech Stack

Backend

.NET Core
C#
Entity Framework Core
SQL Server

Frontend

React
Next.js
Redux Toolkit
TailwindCSS

CMS

Strapi v5
PostgreSQL

DevOps

Docker
Docker Compose

📁 Project Structure

book-app/
├─ Back/
│  ├─ DotNet/API
│  └─ Strapi/
├─ Front/
│  ├─ ReactJS/
│  └─ Angular/ (secondary)
├─ docker-compose.yml
└─ scripts/

🛠 Installation

Clone the repository:

git clone https://github.com/GuillaumeRIzzo/Book-app.git
cd book-app

Start the full environment:
docker-compose up --build
Environment variables must be configured via .env files (see configuration section).

📈 Roadmap

Complete multi-source architecture integration
Improve form validation and UX consistency
CI/CD pipeline setup
Cloud deployment (Azure / AWS)
Performance optimization
Mobile app (Flutter)
