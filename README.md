# 📚 10,000 Hours Frontend

> **Welcome to 10,000 Hours!** A community where learners share their study sessions, celebrate small wins, and keep moving toward mastery.

## ✨ Features

- 🔐 Email/password signup and login, plus Google sign-in.
- 📝 Study feed with post images, skills, study hours, and visibility controls.
- 📈 Progress statistics, streaks, and a skill breakdown—see how your practice adds up.
- 🖼️ Editable profiles with profile pictures.
- 🤝 Friends, friend requests, and a skill-filtered leaderboard.

## 🧰 Requirements

- Node.js and npm.
- The 10,000 Hours Express API.
- Supabase project credentials for Google sign-in.
- A supportive attitude and curiosity. :D

## 🚀 Setup

Install dependencies:

```sh
npm install
```

Create a `.env` file in the project root. Add your local API and Supabase project settings:

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Use the deployed API URL for `VITE_API_URL` when working against the hosted backend. Never commit `.env` or service-role credentials.

Start the development server:

```sh
npm run dev
```

Vite serves the app at `http://localhost:5173` by default.

## 🧪 Available scripts

```sh
npm run dev      # start the development server
npm run build    # create a production build in dist/
npm run preview  # preview the production build
npm run lint     # run ESLint
npm test         # run Playwright browser tests
```

The Playwright tests use `TEST_EMAIL` and `TEST_PASSWORD` from the environment or `.env` for the test account. The account must exist on the configured backend.

## 🧭 Main routes

| Route          | Purpose                               |
| -------------- | ------------------------------------- |
| `/login`       | Sign in with email/password or Google |
| `/signup`      | Create an account and profile         |
| `/`            | Study feed and progress summary       |
| `/profile/:id` | View or edit a learner profile        |
| `/friends`     | Friends and incoming requests         |
| `/leaderboard` | Public study-hours rankings           |

## 🌱 Happy studying!


