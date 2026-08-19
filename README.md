# EduFlow

A Mini LMS / Course Platform built with Next.js 16, Prisma v7 (LibSQL), and Tailwind CSS.

## Features

- **Public**: Course catalog, course details
- **Student**: Dashboard, enroll in courses, lesson viewer, progress tracking, quiz, certificates
- **Admin**: Course management, lesson management, quiz management
- **Design**: Brutalist design system with Kanit font
- **Auth**: NextAuth with Credentials provider

## Tech Stack

- Next.js 16 (App Router, Server Actions)
- Prisma ORM v7 with SQLite (LibSQL Adapter)
- Tailwind CSS
- Zod & React Hook Form
- NextAuth.js

## Getting Started

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database and run seeds (creates demo accounts):
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Demo Accounts

- **Admin**: `admin@eduflow.dev` / `password123`
- **Student**: `student@eduflow.dev` / `password123`
