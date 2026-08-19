# Dream Smith Co-Own Platform

This is the fractional real estate co-ownership platform for **Dream Smith Properties Pvt. Ltd.** It allows investors to browse available fractional shares (starting with the Chihno project), reserve shares, and manage their portfolio and digital certificates via a secure Investor Portal.

## Architecture

*   **Framework**: Next.js 14 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Database**: MongoDB (via Mongoose)
*   **Authentication**: NextAuth.js (Google OAuth for Super Admin, JWT Credentials for Investors & Regular Admins)
*   **Localization**: next-intl (English & Bengali support)

## Local Development

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    Copy `.env.example` to `.env.local` and fill in the required values.
    ```bash
    cp .env.example .env.local
    ```
3.  **Database Seeding** (Optional but recommended for first run):
    Start the dev server and visit `http://localhost:3000/api/seed` to inject the initial Super Admin account and the Chihno project data.
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Vercel Deployment Guide

The application is completely configured and ready to be deployed to Vercel.

1.  **Push to GitHub**:
    Ensure this repository is pushed to your GitHub account.
2.  **Import to Vercel**:
    Log into Vercel and import the repository.
3.  **Environment Variables Setup**:
    Before clicking deploy, you MUST configure the following Environment Variables in Vercel settings:
    *   `MONGODB_URI`: Your production MongoDB connection string.
    *   `NEXTAUTH_SECRET`: Generate a secure random string (e.g., using `openssl rand -base64 32`).
    *   `NEXTAUTH_URL`: The production URL of your app (e.g., `https://co-own.dreamsmith.com`).
    *   `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Your OAuth credentials from Google Cloud Console.
    *   `ENCRYPTION_KEY`: A strict 32-character string used for encrypting NID and Bank details in the database.
    *   `SEED_SECRET`: A random string required to call `/api/seed` outside of local development (protects the seeding endpoint in preview/production).
4.  **Deploy**:
    Click "Deploy". Security headers are configured in `next.config.mjs` and applied automatically.
5.  **Final Polish**:
    Once deployed, log into the Admin panel using your Super Admin Google account. Navigate to `Media Manager` and upload the final high-resolution hero images and renders for the Chihno project.

## Security Features

*   **Role-Based Access Control**: Strict segregation between `SUPER_ADMIN` and `REGULAR_ADMIN`.
*   **Field-Level Encryption**: Sensitive PII (NID, Bank Details) are encrypted at rest using `aes-256-cbc`.
*   **Rate Limiting**: In-memory rate limiting applied to the `/api/apply` endpoint and the authentication route to prevent brute-force attacks.
*   **HTTP Security Headers**: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` are enforced globally.
