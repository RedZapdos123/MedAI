# MedAI:

## Introduction:

MedAI is a web application designed to provide AI-powered assistance for health-related information. It consists of two main components: MediGen and CareChat. The project is intended for informational purposes only and is not a substitute for professional medical advice.

## Features:

*   **MediGen AI**: This feature allows users to upload or paste a medical report. The application then provides a simplified summary, key findings, actionable recommendations, and answers to frequently asked questions in plain language.
*   **CareChat**: This is an AI-powered chatbot that offers general health information, lifestyle tips, and mental wellness support. It includes safety filters to detect crisis situations and provide appropriate resources.

## Technology Stack:

### Client:

*   **Framework**: React.
*   **Build Tool**: Vite.
*   **Styling**: Tailwind CSS.
*   **Routing**: React Router.
*   **HTTP Client**: Axios.

### Server:

*   **Framework**: Express.js.
*   **Database**: MongoDB with Mongoose.
*   **Authentication**: Not implemented.
*   **File Handling**: Multer for file uploads and pdf-parse for PDF text extraction.
*   **Security**: Helmet for security headers and express-rate-limit for rate limiting.
*   **Environment Variables**: Dotenv.

## Disclaimer:

This application is a prototype and for demonstration purposes only. It does not provide medical diagnoses, prescriptions, or emergency instructions. If you are experiencing urgent symptoms or a medical emergency, please contact your local emergency services immediately.

## Visual Demonstrations:

![MedAI Home Page](visuals/MedAIHomePage.png)
The home page shows the MediGen and CareChat entry cards and a visible safety notice.

![MediGen Upload Screen](visuals/MedGenAIMedicalTextReportUpload.png)
The MediGen upload screen shows options to upload a PDF or paste report text for extraction.

![MediGen Summary View](visuals/MedGenAIMedicalReportSummary.png)
The summary view displays a plain-language summary, key findings, and recommendations.

![CareChat General Mode](visuals/CareChatGeneralWellBeingChat.png)
CareChat in general mode provides friendly lifestyle and wellness guidance.

![CareChat Mental Wellness Mode](visuals/CareChatMentalWellBeingChat.png)
CareChat in mental wellness mode offers supportive messages and crisis resources when needed.
