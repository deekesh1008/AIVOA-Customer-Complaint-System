```markdown
# AIVOA - AI Powered Customer Complaint Management System

An AI-powered Customer Complaint Management System designed for pharmaceutical API and FDF manufacturing environments.

This project demonstrates how Artificial Intelligence can assist Quality Management System (QMS) complaint workflows by automatically extracting complaint information from documents, understanding user conversations, updating complaint details, and maintaining structured complaint records.

The system supports complaint intake from PDF documents, emails, text input, and AI-assisted conversations.

---

# Project Overview

In pharmaceutical manufacturing, customer complaints require proper documentation, investigation, risk evaluation, and traceability.

Manual complaint registration can be time-consuming and error-prone. This project introduces an AI-powered workflow where quality teams can provide complaint information through different sources and receive structured complaint data automatically.

The system helps users:

- Extract complaint details from PDF/email/text sources.
- Automatically populate complaint forms.
- Edit complaint information through natural language commands.
- Interact with an AI complaint assistant.
- Save structured complaint records into a database.

---

# Key Features

## AI Complaint Document Extraction

Users can upload:

- PDF complaint documents
- Email complaint formats
- Text complaint descriptions

The AI extracts:

- Complaint source
- Customer information
- Product details
- Product strength/grade
- Batch information
- Manufacturing date
- Expiry date
- Quantity affected
- Complaint type
- Complaint description
- Initial severity
- Priority


## AI Complaint Assistant

The integrated AI assistant allows users to:

- Ask questions about complaints.
- Provide additional complaint information.
- Modify existing complaint details.
- Receive AI-generated responses.

Example:

```

Change the batch number to ABC123

```

AI updates only the required complaint field.


## Automatic Complaint Form Filling

After AI processing, extracted information automatically fills the complaint registration form.

This reduces manual data entry and improves consistency.


## AI Based Complaint Editing

The system maintains existing complaint information and updates only the fields mentioned by the user.

Example:

```

Update affected quantity to 100 kg

```

Only the quantity field is modified.


## Complaint Storage

Processed complaints can be saved into the database with structured information including:

- Customer details
- Product information
- Complaint details
- Severity
- Priority
- AI generated insights

---

# System Architecture

```

React Frontend

```
    |
    |
```

Complaint Management Interface

```
    |
    |
```

---

Complaint Form
AI Chat Assistant
Document Upload

```
    |
    |
```

FastAPI Backend

```
    |
    |
```

LangGraph AI Workflow

```
    |
    |
```

---

Intent Detection Agent

Document Extraction Agent

Complaint Editing Agent

```
    |
    |
```

Groq LLM

```
    |
    |
```

MySQL Database

```

---

# Technology Stack

## Frontend

- React.js
- Tailwind CSS
- Vite
- Axios
- Redux Toolkit configured
- React Context
- Lucide Icons
- Google Inter Font


## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- MySQL


## Artificial Intelligence

- LangGraph
- LangChain
- Groq LLM
- Structured AI extraction
- AI based complaint processing

---

# AI Workflow

## Document Processing Workflow

```

Upload Complaint Document

```
      |
```

Document Extraction Node

```
      |
```

LLM Processing

```
      |
```

Structured Complaint Data

```
      |
```

Frontend Form Update

```


## Chat Workflow

```

User Message

```
  |
```

Intent Detection

```
  |
```

Complaint Extraction / Update

```
  |
```

AI Response

```
  |
```

Complaint State Update

```

---

# Project Structure

## Backend

```

backend

app

├── api

│   ├── ai.py

│   └── complaints.py

├── ai

│   ├── graph.py

│   ├── nodes.py

│   ├── prompts.py

│   ├── state.py

│   └── llm.py

├── models

│   └── complaint.py

├── schemas

│   └── ai_response.py

└── db

```
└── database.py
```

```


## Frontend

```

frontend

src

├── components

│   └── features

│       └── complaint

│           ├── ComplaintForm.jsx

│           ├── AICopilot.jsx

│           ├── ChatBox.jsx

│           └── FileUpload.jsx

├── context

│   └── ComplaintContext.jsx

├── services

│   ├── aiService.js

│   └── complaintService.js

└── pages

```
└── ComplaintDashboardPage.jsx
```

````

---

# Setup Instructions

## Backend Setup

Create virtual environment:

```bash
python -m venv venv
````

Activate environment:

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` file:

```
GROQ_API_KEY=your_api_key

DATABASE_URL=your_database_url
```

Run backend:

```bash
uvicorn app.main:app --reload
```

Backend:

```
http://localhost:8000
```

---

## Frontend Setup

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend:

```
http://localhost:5173
```

---

# Database

Database:

```
MySQL
```

Main table:

```
complaints
```

Stores:

* Customer information
* Product details
* Complaint information
* Severity
* Priority
* AI processed data

---

# Design Decisions

## LangGraph Workflow

LangGraph was selected because complaint processing involves multiple AI tasks:

* Intent classification
* Document extraction
* Complaint editing

A graph-based workflow provides better control and scalability for future AI agents.

## Structured AI Output

AI responses are converted into structured complaint objects instead of storing raw text.

Benefits:

* Reliable database storage
* Better frontend rendering
* Easier validation

## Human Assisted AI Workflow

The system is designed as an AI assistant rather than a replacement for quality teams.

AI helps with:

* Data extraction
* Complaint organization
* Initial analysis

Final quality decisions remain with human experts.

---

# Future Improvements

Possible production enhancements:

* User authentication and authorization.
* Role based access control.
* Complaint history tracking.
* Duplicate complaint detection.
* Automated CAPA recommendation.
* Complaint completeness scoring.
* OCR support for scanned documents.
* Quality dashboard analytics.

---

# Demo Workflow

The demonstration covers:

1. Upload pharmaceutical complaint PDF.
2. AI extracts complaint information.
3. Complaint form is automatically populated.
4. User updates complaint using AI chat.
5. Complaint is saved into database.

---

# Author

Developed for AIVOA Full Stack Developer Assessment.

AI Powered Customer Complaint Management System.

```
```
