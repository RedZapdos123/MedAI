# Installation and Setup:

## Introduction:

This document provides instructions on how to set up and run the MedAI project on a local machine.

## Prerequisites:

Before you begin, ensure you have the following installed on your system:

*   **Node.js**: A JavaScript runtime environment.
*   **npm**: The Node.js package manager, which comes with Node.js.
*   **MongoDB**: A NoSQL database. Make sure your MongoDB server is running.

## Server Setup:

1.  **Navigate to the server directory**:
    ```sh
    cd server
    ```

2.  **Install dependencies**:
    ```sh
    npm install
    ```

3.  **Create a `.env` file**:
    Create a file named `.env` in the `server` directory and add the following environment variables. You may need to provide your own values, such as your MongoDB connection string and API keys for the AI service.

    ```
    PORT=4000
    MONGODB_URI=mongodb://localhost:27017/medai
    CLIENT_ORIGIN=http://localhost:5173
    ```

4.  **Start the server**:
    For development, you can use the `dev` script, which uses `nodemon` to automatically restart the server on file changes.
    ```sh
    npm run dev
    ```
    For production, use the `start` script.
    ```sh
    npm start
    ```
    The server should now be running on `http://localhost:4000`.

## Client Setup:

1.  **Navigate to the client directory**:
    ```sh
    cd client
    ```

2.  **Install dependencies**:
    ```sh
    npm install
    ```

3.  **Start the client**:
    ```sh
    npm run dev
    ```
    The client application should now be running on `http://localhost:5173`.

## Configuration:

### Server:

The server's behavior can be configured through environment variables in the `.env` file.

*   `PORT`: The port on which the server will run. Defaults to `4000`.
*   `MONGODB_URI`: The connection string for your MongoDB database. Defaults to `mongodb://localhost:27017/medai`.
*   `CLIENT_ORIGIN`: The URL of the client application, for CORS configuration. Defaults to `http://localhost:5173`.

### Client:

The client's API base URL is configured in `client/src/api/apiClient.js`. By default, it points to the server's address.

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
