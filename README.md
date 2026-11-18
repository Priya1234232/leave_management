# Leave Management System

A beginner-friendly Leave Management System with:
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB (local or MongoDB Atlas)

## Folder structure

```text
leave-management-system/
├── client/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── vercel.json
└── server/
    ├── config/
    │   └── db.js
    ├── models/
    │   └── User.js
    ├── routes/
    │   └── leaveRoutes.js
    ├── .env.example
    ├── package.json
    └── server.js
```

## 1. Run the backend locally

Open a terminal in the `server` folder:

```bash
npm install
```

Copy `.env.example` to a new file named `.env`, then set your MongoDB connection string.

For local MongoDB:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/leave_management
```

For MongoDB Atlas, use your own Atlas connection string.

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5050`.
Test it at `http://localhost:5050/api/health`.

## 2. Run the frontend locally

Open `client/index.html` in your browser, or use the VS Code Live Server extension.

For local testing, open `client/script.js` and temporarily change `API_BASE` to:

```js
const API_BASE = "http://localhost:5050";
```

For the deployed frontend, set it back to your Render backend URL.

## 3. Deploy the backend to Render

1. Push this project to GitHub.
2. Create a Render **Web Service** using the `server` folder as the Root Directory.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `NODE_ENV` = `production`
6. Deploy. Render provides your backend URL.

## 4. Deploy the frontend to Vercel

1. Import the GitHub repository into Vercel.
2. Set Root Directory to `client`.
3. Framework Preset: `Other`.
4. Build Command: leave empty.
5. Output Directory: `.`
6. Deploy.

The frontend `script.js` is configured to call:
`https://leave-management-x6i5.onrender.com`

If your Render URL changes, update `API_BASE` in `client/script.js` and redeploy Vercel.

## Important notes

- This is a simple learning/demo project. Login currently uses email only and does not provide password-based authentication.
- Do not commit your `.env` file or share your MongoDB username/password.
- Leave balances are stored in MongoDB for each registered user.
