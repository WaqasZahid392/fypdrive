# ☁️ ZeeDrive - Secure Cloud Storage Vault

ZeeDrive is a modern, secure, and blazing-fast cloud storage platform built with **Next.js 15 (App Router)**. It provides a personal vault experience with PIN-based authentication, real-time storage calculation, folder structures, and seamless file management using Neon DB and Cloudinary.

## 🚀 Features

- **Personal Vault Security:** 6-digit PIN-based authentication.
- **Deep Folder Structures:** Create folders, sub-folders, and organize files easily.
- **Real-Time Storage Calculation:** Track exactly how much storage you have used.
- **Advanced File Management:** Rename, delete, and view your files instantly.
- **File & Folder Downloads:** Download single files or an entire folder as a `.zip` archive.
- **Light/Dark Mode:** Beautiful UI with seamless theme switching.
- **Tech Stack:** Next.js (App Router), Drizzle ORM, Neon Serverless Postgres, Cloudinary, TailwindCSS, JSZip.

---

## 🛠️ Installation & Setup Guide

Follow these steps to clone and run ZeeDrive on your local machine.

### 1. Clone the Repository
Open your terminal and run the following command to clone the project:

```bash
git clone https://gitlab.com/ZohaibandSaeed/zeedrive.git
cd zeedrive
```

### 2. Install Dependencies
Install all required NPM packages:

```bash
npm install
```

### 3. Setup Environment Variables
You need to provide your own database and storage API keys. 
Create a new file named **`.env.local`** (or `.env`) in the root directory of the project and add the following keys:

```env
# 1. Neon DB Connection String
# Get this from https://neon.tech/ (Make sure to include ?sslmode=require)
DATABASE_URL="postgresql://<user>:<password>@<host>/<dbname>?sslmode=require"

# 2. Cloudinary Setup (For File Storage)
# Get these from your Cloudinary Dashboard: https://cloudinary.com/
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```
*(⚠️ **Note:** Never commit your `.env.local` file to GitHub/GitLab. It is already added to `.gitignore` for security).*

### 4. Setup the Database (Drizzle ORM)
Push the database schema to your Neon Postgres database using Drizzle:

```bash
npm run db:push
```

### 5. Run the Application
Start the Next.js development server:

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to access your ZeeDrive.

---

## 🚀 Deployment (Netlify/Vercel)
If you want to deploy this app to Netlify or Vercel:
1. Connect your GitLab repository.
2. In the deployment settings, make sure the build command is `npm run build` and output directory is `.next`.
3. Add all the Environment Variables (`DATABASE_URL`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) in the Netlify/Vercel dashboard.
4. Deploy!
