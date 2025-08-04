@echo off
REM Project Management Dashboard - Vercel Deployment Script (Windows)

echo 🚀 Starting deployment to Vercel...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Check if vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the project
echo 🔨 Building the project...
npm run build

REM Check if build was successful
if %errorlevel% equ 0 (
    echo ✅ Build completed successfully!
) else (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

echo 🎉 Deployment completed!
echo 📝 Check your Vercel dashboard for the deployment URL.
echo 🔧 Remember to set environment variables in Vercel dashboard:
echo    REACT_APP_API_URL=https://backend-z5zf.onrender.com

pause 