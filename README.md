This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Translator App

A Next.js application that provides translation and dictionary lookup features using OpenAI's API.

## Features

- Text translation between multiple languages
- Dictionary lookups with definitions and examples
- History of past lookups stored in a database

## Getting Started

First, clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/translator-app.git
cd translator-app
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# API Keys
OPENAI_API_KEY=your_openai_api_key_here

# Database
DATABASE_URL="file:./dev.db"

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

Initialize the database:

```bash
npx prisma migrate dev
```

### Running the Application

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Pushing to GitHub

Before pushing to GitHub, make sure to:

1. Add a `.gitignore` file to exclude sensitive files
2. Don't commit your `.env` file with real API keys
3. Make sure database files are properly handled in your `.gitignore`

Files to add before pushing:

```bash
# Add all source code files
git add .

# Exclude .env files with real credentials
git reset -- .env

# Commit the changes
git commit -m "Initial commit for translator app"

# Push to GitHub
git push origin main
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
