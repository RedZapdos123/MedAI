# API Documentation:

## Introduction:

This document provides details about the API endpoints for the MedAI server.

## Base URL:

The default base URL for the API is `http://localhost:4000`.

## Endpoints:

### Health Check:

*   **`GET /api/health`**:
    *   **Description**: A simple health check endpoint to verify that the server is running.
    *   **Response**:
        ```json
        {
          "status": "ok",
          "timestamp": "2025-11-16T12:00:00.000Z"
        }
        ```

### Chat:

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

*   **`POST /api/chat`**:
    *   **Description**: Handles chat messages for the CareChat feature.
    *   **Request Body**:
        ```json
        {
          "sessionId": "optional-session-id",
          "message": "User's message text.",
          "context": {
            "persona": "general"
          }
        }
        ```
    *   **Normal Response**:
        ```json
        {
          "reply": "AI's response text.",
          "sessionId": "session-id",
          "moderation": {
            "riskLevel": "low"
          }
        }
        ```
    *   **Crisis Response**:
        ```json
        {
          "crisis": true,
          "resources": [
            { "name": "Emergency Services", "url": "tel:911" }
          ],
          "text": "Crisis support message.",
          "moderation": {
            "riskLevel": "high"
          }
        }
        ```

### Report:

*   **`POST /api/report/upload`**:
    *   **Description**: Uploads a medical report, either as a file or as plain text.
    *   **Request (File)**: `multipart/form-data` with a `file` field containing the PDF.
    *   **Request (Text)**: `application/json` with a `text` field.
        ```json
        {
          "text": "Pasted medical report text."
        }
        ```
    *   **Response**:
        ```json
        {
          "text": "Sanitized text of the report.",
          "preview": "A short preview of the text.",
          "estimatedLength": 1234,
          "id": "temporary-uuid"
        }
        ```

*   **`POST /api/report/summarize`**:
    *   **Description**: Summarizes the text of a medical report.
    *   **Request Body**:
        ```json
        {
          "text": "The text of the medical report to summarize.",
          "options": {
            "language": "en",
            "depth": "short"
          }
        }
        ```
    *   **Response**:
        ```json
        {
          "summary": "The plain-language summary.",
          "keyFindings": ["Finding 1.", "Finding 2."],
          "recommendations": ["Recommendation 1.", "Recommendation 2."],
          "faq": [
            { "q": "Question 1?", "a": "Answer 1." }
          ],
          "reportId": "database-id-of-the-report"
        }
        ```
