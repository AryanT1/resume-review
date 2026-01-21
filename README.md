# 📄 AI-Powered Resume Reviewer Backend

[![Live Demo](https://img.shields.io/badge/Live%20Demo-resume--review.aryanthakur.info-blue?style=for-the-badge&logo=vercel)](https://resume-review.aryanthakur.info/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20TypeScript-339933?style=for-the-badge&logo=nodedotjs)](https://github.com/AryanT1/resume-review/tree/main/backend)
[![AI](https://img.shields.io/badge/AI%20Integration-OpenAI%20%7C%20LLM-FF69B4?style=for-the-badge&logo=openai)](https://github.com/AryanT1/resume-review)

## 🚀 Project Overview

The **AI-Powered Resume Reviewer** is a full-stack application designed to provide instant, constructive feedback on resumes using a Large Language Model (LLM). This project demonstrates a robust backend architecture capable of handling file uploads, performing complex text extraction, and orchestrating an external AI service to deliver structured, actionable data.

This repository contains the source code for both the backend API and the frontend user interface.

## ✨ Key Backend Features

The core of this project is the backend service, which handles the entire review pipeline:

*   **File Upload Handling:** Securely accepts resume files (PDF, DOCX) via a dedicated API endpoint using `multer`.
*   **Intelligent Text Extraction:** Utilizes the `unpdf` library to reliably parse and extract clean text content from various document formats, preparing it for LLM processing.
*   **LLM Orchestration:** Sends the extracted resume text to a powerful LLM (via the OpenAI API) with a carefully engineered prompt to generate a structured, comprehensive review.
*   **Scalable API:** Built with **Node.js** and **Express** to ensure high-performance and low-latency response times for the review process.
*   **CORS Configuration:** Implements a secure CORS policy to allow communication with the separate frontend application.

## 💻 Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend** | Node.js, Express | High-performance runtime and web framework. |
| **Language** | TypeScript | Ensures type safety and code maintainability. |
| **AI/LLM** | OpenAI API | Used for generating the detailed resume review. |
| **File Handling** | `multer` | Middleware for handling multipart form data (file uploads). |
| **Text Extraction** | `unpdf` | Library for extracting text from PDF and other document types. |
| **Frontend** | React, Vite | Modern, fast, and type-safe user interface. |

## ⚙️ System Architecture & Flow

The system follows a clear, three-step process to deliver the resume review:

1.  **Upload:** The user uploads a resume file (PDF/DOCX) via the React frontend.
2.  **Processing (Backend):** The backend API receives the file, uses `multer` to buffer the data, and then employs `unpdf` to extract the raw text content.
3.  **Review Generation (Backend):** The extracted text is passed to the LLM with a specific prompt to generate a structured, actionable review. The final review is then returned to the frontend for display.

## 🌐 Live Demo

Experience the application live:
[**resume-review.aryanthakur.info**](https://resume-review.aryanthakur.info/)

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18+)
*   OpenAI API Key (or OpenRouter API Key)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AryanT1/resume-review.git
    cd resume-review
    ```

2.  **Set up Backend:**
    ```bash
    cd backend
    npm install
    ```

3.  **Set up Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

1.  **Configure Environment Variables:**
    Create a `.env` file in the `backend` directory with your API key:
    ```dotenv
    OPENAI_API_KEY="YOUR_API_KEY"
    ```

2.  **Start Backend Server:**
    ```bash
    cd backend
    npm run dev
    ```

3.  **Start Frontend Development Server:**
    ```bash
    cd ../frontend
    npm run dev
    ```
    The frontend will typically be available at `http://localhost:5173`.

## 🗺️ API Endpoint

The core functionality is exposed through a single, robust API endpoint:

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/review` | Uploads a resume file and returns the AI-generated review. | `multipart/form-data` with a file named `resume` |


