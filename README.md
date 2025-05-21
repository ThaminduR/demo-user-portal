# OIDC Registration App

A React application that supports login via WSO2 Identity Server (OIDC with PKCE) and displays the user's profile. This app is also structured to support a dynamic, multi-step registration flow (coming soon).

## 🚀 Features

- 🔐 Login via WSO2 IS (OIDC PKCE flow)
- 💾 Session-based token storage
- 🎨 UI built with Material UI (MUI)
- 👤 View-only profile page using ID token claims
- 🛠️ Configurable `config.json`
- 🔐 Protected routes
- 📦 Ready for future multi-step registration logic

---

## 🧩 Prerequisites

- Node.js (v16+ recommended)
- Yarn or npm
- A running instance of WSO2 Identity Server

---

## ⚙️ Configuration

Edit the `public/config.json` with your OIDC settings:

```json
{
  "oidc": {
    "issuer": "https://<your-is-host>:9443/oauth2/token",
    "client_id": "<your-client-id>",
    "redirect_uri": "http://localhost:3000/callback",
    "scope": "openid profile email"
  },
  "registration": {
    "executeEndpoint": "/api/server/v1/registration/execute"
  }
}
```

## 🛠️ Setup & Run

```
# Step 1: Install dependencies
npm install

# or with yarn
yarn install

# Step 2: Start the app
npm start

# or
yarn start
```
