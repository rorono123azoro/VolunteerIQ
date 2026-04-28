# VolunteerIQ

VolunteerIQ is an AI-powered volunteer coordination platform designed for NGOs and nonprofits. It streamlines the volunteer lifecycle by offering intelligent matching, real-time tracking, and automated impact reporting, all built on a robust Google technology stack.

## Features & Functions

- **Role-Based Portals:** Separate, dedicated dashboards for Volunteers and Coordinators with tailored views.
- **Authentication:** Secure Google Sign-In and session management powered by Firebase Authentication.
- **Intelligent Matching:** Matches volunteers to opportunities based on skills, availability, and interests.
- **Real-Time Tracking & Dashboards:** Coordinators can monitor active opportunities, view applicant statuses, and manage logistics effectively.
- **Automated Impact Reporting:** Automatically generated impact metrics that NGOs can use for reporting and visibility.

## Tech Stack

The platform is a modern, full-stack application leveraging the following technologies:

### Frontend
- **React 18:** Component-based UI library.
- **Vite:** Next-generation frontend tooling for blazing fast builds.
- **React Router:** For seamless single-page application routing and protected routes.
- **Vanilla CSS:** Custom design system avoiding heavy CSS frameworks.

### Backend & Database
- **FastAPI (Python):** High-performance Python backend for complex data processing.
- **Firebase Cloud Functions (Node.js):** Serverless architecture for handling background tasks and triggers.
- **Firebase Firestore:** NoSQL cloud database for real-time data syncing across clients.
- **Firebase Authentication:** Handles user identity and role assignment.

## Use Cases

1. **For Volunteers:**
   - Easily browse and apply to volunteering opportunities that fit their schedule and skills.
   - Track their total impact (hours logged, events completed).
   
2. **For Coordinators:**
   - Create, edit, and manage volunteering events.
   - Review volunteer applications, accept or decline them.
   - Generate reports to showcase the NGO's real-time impact.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- Firebase CLI (`npm install -g firebase-tools`)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/VolunteerIQ.git
   cd VolunteerIQ
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup (FastAPI)**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

4. **Firebase Functions Setup**
   ```bash
   cd functions
   npm install
   ```

5. **Running the Firebase Emulators**
   To test Firestore and Auth locally without hitting production data:
   ```bash
   firebase emulators:start
   ```

## Contributing
Contributions, issues, and feature requests are welcome! 
