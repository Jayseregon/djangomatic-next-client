# Djangomatic: Full-Stack Next.js Application

[![Version](https://img.shields.io/badge/version-2.4.5-blue)](https://github.com/teleconapplications/djangomatic_prototype)
[![Last Updated](https://img.shields.io/badge/last%20updated-2025.05.06-brightgreen)](https://github.com/teleconapplications/djangomatic_prototype)

## Project Overview

Djangomatic is a comprehensive full-stack application built with Next.js, NextUI, and Prisma. This project demonstrates a range of modern web development practices, including a robust backend, a dynamic frontend, and database management. It serves as a showcase of skills in building scalable and maintainable web applications.

The platform hosts a variety of tools, including automation applications, SaaS-like functionalities, and an advanced RAG (Retrieval Augmented Generation) chatbot. The chatbot leverages the Vercel AI SDK and interfaces with a dedicated FastAPI backend designed for specialized AI tool calling, enabling sophisticated interactions and information retrieval.

## Technologies Used

This project leverages a modern technology stack to deliver a high-quality user experience and robust functionality:

- **Framework**: [Next.js 15](https://nextjs.org/docs/getting-started)
- **UI Components**: [HeroUI](https://www.heroui.com) (previously NextUI)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Tailwind Variants](https://tailwind-variants.org)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Animations**: [Motion](https://motion.dev/) (previously framer-motion)
- **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes)
- **ORM**: [Prisma](https://www.prisma.io/)
- **AI/Chatbot**: [Vercel AI SDK](https://sdk.vercel.ai), [@ai-sdk/openai](https://www.npmjs.com/package/@ai-sdk/openai)
- **Backend Integration**: Communication with a custom [FastAPI](https://fastapi.tiangolo.com/) backend for AI tools
- **Testing**: [Jest](https://jestjs.io/)
- **Linting & Formatting**: [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **API Communication**: [Axios](https://axios-http.com/)
- **State Management**: React hooks, context
- **Database**: PostgreSQL (managed via Prisma)

## Key Features

- **Modular SaaS Architecture:**
  - Offers a suite of specialized applications tailored for various telecom clients.
  - Applications are categorized by function, providing granular control and access.
- **Comprehensive Admin Dashboard:**
  - Centralized user management: View, edit, and manage user accounts and their specific permissions.
  - Role-based access control: Define and assign roles with fine-grained permissions for different application modules and features.
  - Azure Blob Storage Management: Interface for uploading, listing, and deleting files stored in Azure, particularly for video tutorials and other shared resources.
- **R&D and Performance Tracking System:**
  - Integrated bug and task management system for R&D projects.
  - Tracks performance metrics for both SaaS applications and the integrated chatbot.
  - Differentiated views and functionalities for admin and non-admin users within the tracking system.
- **Advanced Chatbot Functionality:**
  - AI-powered chatbot for user assistance and information retrieval.
  - Secure file upload capability directly to Azure Blob Storage via SAS tokens.
  - Permission-gated access to specialized knowledge bases.
- **Reporting and Documentation:**
  - Generation of specialized reports with image upload support to Azure.
  - Integrated documentation and video tutorial platform, with content access controlled by user permissions.
  - Content (videos, documents) dynamically loaded and protected using `WithPermissionOverlay`.
- **Robust Security & Permissions Model:**
  - Extensive use of `WithPermissionOverlay` to protect routes and components based on user roles and specific permissions.
  - Session management and authentication handled by NextAuth.js, with user roles determined at login.
- **Azure Cloud Deployment:**
  - Containerized application using Docker for consistent deployment environments.
  - Deployed on Azure Web Apps, leveraging Azure Blob Storage for scalable file storage.
  - Configured with Content Security Policy (CSP) and SSH access for secure operation on Azure.
- **Modern Tech Stack:**
  - Built with Next.js (React framework) for server-side rendering and static site generation.
  - TypeScript for type safety and improved developer experience.
  - Utilizes Prisma ORM for database interactions. 
  - NextUI and Tailwind CSS for a modern and responsive user interface.
  - Jest and React Testing Library for comprehensive unit and integration testing.
