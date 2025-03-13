# OCR-LLM Chat

A full-stack application that extracts text from uploaded documents using OCR and allows users to interact with the content through LLM-powered explanations.

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

- **User Authentication**: Secure login and registration
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
- Zod for validation

### Backend
- NestJS framework
- Prisma ORM for database interactions
- PostgreSQL database
- Tesseract.js for OCR
- OpenAI API for LLM integration
- JWT for authentication

## Project Structure

```
ocr-llm-challenge/
├── backend/                   # NestJS backend application
│   ├── prisma/                # Prisma ORM configuration
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── documents/         # Document handling module
│   │   ├── interactions/      # LLM interactions module
│   │   ├── users/             # User management module
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
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions
│   │   ├── pages/             # Application pages (if using Pages Router)
│   │   └── styles/            # Global styles
│   ├── .env.local             # Frontend environment variables
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
- OpenAI API key

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ocr-llm-challenge.git
   cd ocr-llm-challenge/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables) section).

4. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the backend server:
   ```bash
   npm run start:dev
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
JWT_EXPIRATION="1d"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Server
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

#### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Usage

1. Register a new account or log in to an existing one.
2. Upload a document from the dashboard page.
3. Wait for the OCR processing to complete.
4. View the extracted text and interact with it using the LLM integration.
5. Ask questions about the document content to get AI-powered explanations.
6. Download the document with the extracted text and interaction history if needed.

## API Documentation

### Authentication Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token

### Document Endpoints

- `POST /documents` - Upload a new document
- `GET /documents` - Get all documents for the authenticated user
- `GET /documents/:id` - Get a specific document
- `DELETE /documents/:id` - Delete a document

### Interaction Endpoints

- `POST /interactions` - Create a new LLM interaction for a document
- `GET /interactions/document/:id` - Get all interactions for a specific document

## Database Schema

### User

| Field     | Type       | Description                      |
|-----------|------------|----------------------------------|
| id        | String     | Primary key, UUID                |
| email     | String     | User email, unique               |
| password  | String     | Hashed password                  |
| name      | String?    | User's name (optional)           |
| createdAt | DateTime   | Creation timestamp               |
| updatedAt | DateTime   | Last update timestamp            |

### Document

| Field           | Type       | Description                      |
|-----------------|------------|----------------------------------|
| id              | String     | Primary key, UUID                |
| fileName        | String     | Original file name               |
| originalFileUrl | String     | URL to the stored original file  |
| extractedText   | String?    | OCR extracted text               |
| userId          | String     | Foreign key to User              |
| createdAt       | DateTime   | Creation timestamp               |
| updatedAt       | DateTime   | Last update timestamp            |

### Interaction

| Field      | Type       | Description                      |
|------------|------------|----------------------------------|
| id         | String     | Primary key, UUID                |
| query      | String     | User's question                  |
| response   | String     | LLM's response                   |
| documentId | String     | Foreign key to Document          |
| createdAt  | DateTime   | Creation timestamp               |
| updatedAt  | DateTime   | Last update timestamp            |

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. When a user registers or logs in, they receive a JWT token that is stored in the browser's local storage. This token is included in the Authorization header for all API requests that require authentication.

## OCR Implementation

The OCR functionality is implemented using Tesseract.js, a pure JavaScript port of the Tesseract OCR engine. When a document is uploaded, it goes through the following process:

1. The document is saved to the server or cloud storage.
2. Tesseract.js processes the image and extracts text.
3. The extracted text is stored in the database along with the document metadata.

## LLM Integration

The application integrates with OpenAI's GPT models to provide context and explanations for the extracted text. When a user asks a question about a document:

1. The question, along with the document's extracted text, is sent to the LLM.
2. The LLM generates a response based on the context of the document.
3. The interaction (question and response) is stored in the database.

## Deployment

### Backend Deployment

The NestJS backend can be deployed to platforms like Heroku, Railway, or Render:

1. Set up the appropriate environment variables on the hosting platform.
2. Configure the PostgreSQL database connection.
3. Deploy the application using the platform's deployment tools.

### Frontend Deployment

The Next.js frontend can be deployed to Vercel:

1. Connect your GitHub repository to Vercel.
2. Set up the environment variables.
3. Vercel will automatically deploy the application when changes are pushed to the repository.

## Testing

### Backend Tests

To run the backend tests:

```bash
cd backend
npm run test
```

### Frontend Tests

To run the frontend tests:

```bash
cd frontend
npm run test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.