# OCR-LLM Chat

A full-stack application that extracts text from uploaded documents using OCR and allows users to interact with the content through LLM-powered explanations.

[Visit now!](https://ocr-llm-chat.vercel.app)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [OCR Implementation](#ocr-implementation)
- [LLM Integration](#llm-integration)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project was developed as a solution to the Paggo OCR Challenge. It provides a platform where users can upload document images, extract text using Optical Character Recognition (OCR), and interact with the extracted content using a Large Language Model (LLM) to get explanations and insights.

## Features

- **User Authentication**: Secure login and registration using Firebase
- **Document Upload**: Upload invoice images and other documents
- **OCR Processing**: Extract text from uploaded documents
- **LLM Integration**: Ask questions about the document content and receive AI-powered explanations
- **Document Management**: View all previously uploaded documents
- **Download Options**: Export documents with extracted text and LLM interactions
- **User Interface**: Intuitive UI with real-time feedback and progress indicators

## Tech Stack

### Frontend

- Next.js (React framework)
- Tailwind CSS
- Axios for API requests
- React Hook Form for form handling
- Firebase Authentication

### Backend

- NestJS framework
- Prisma ORM for database interactions
- PostgreSQL database
- Tesseract.js for OCR
- OpenAI API for LLM integration
- JWT for authentication
- Firebase Admin SDK

## Project Structure

```
ocr-llm-challenge/
├── backend/                   # NestJS backend application
│   ├── prisma/                # Prisma ORM configuration
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── documents/         # Document handling module
│   │   ├── app.module.ts      # Main application module
│   │   └── main.ts            # Application entry point
│   ├── .env                   # Environment variables
│   └── package.json           # Backend dependencies
│
├── frontend/                  # Next.js frontend application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── app/               # Next.js app directory
│   │   ├── components/        # Reusable UI components
│   │   ├── lib/               # Utility functions
│   │   └── models/            # Utility models
│   ├── .env                   # Frontend environment variables
│   └── package.json           # Frontend dependencies
│
├── .gitignore                 # Git ignore file
└── README.md                  # Project documentation
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Firebase account
- OpenAI API key

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/LeandroRochAlg/OCR-LLM-Chat.git
   cd ocr-llm-challenge/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables) section).

4. Set up the database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the backend server:

   ```bash
   nest start --watch
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables) section).

4. Start the development server:

   ```bash
   npm run dev
   ```

### Environment Variables

#### Backend (.env)

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ocr_llm_db"

# Authentication
JWT_SECRET="your-jwt-secret"
PORT=3001
o="http://localhost:3000"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Firebase
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_CLIENT_EMAIL="your-firebase-client-email"
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
```

#### Frontend (.env.local)

```
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-firebase-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-firebase-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-firebase-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-firebase-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-firebase-app-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-firebase-measurement-id"
NEXT_PUBLIC_API_URL=http://localhost:3001/api/
```

### How to Get Firebase Keys

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Navigate to **Project Settings > General**
4. Under **Your apps**, add a new web app if not already created
5. Copy the Firebase config and paste it into the frontend `.env`
6. Navigate to **Service accounts** and generate a private key for the backend, then use the values for `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY`

### How to Get OpenAI API Key

1. Go to [OpenAI API](https://platform.openai.com/signup/)
2. Sign up or log in
3. Navigate to **API Keys**
4. Generate a new API key and add it to the backend `.env`

## Usage

1. Register a new account or log in to an existing one.
2. Upload a document from the dashboard page.
3. Wait for the OCR processing to complete.
4. View the extracted text and interact with it using the LLM integration.
5. Ask questions about the document content to get AI-powered explanations.
6. Download the document with the extracted text and interaction history if needed.

## License

This project is licensed under the MIT License.