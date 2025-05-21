# 🧑‍💻 User Portal

A modern, responsive React app for user registration and login using OpenID Connect and Passkeys (WebAuthn), styled with Tailwind CSS and animated with Framer Motion.

---

## 🚀 Features

- 🔐 OIDC login (via WSO2 IS or any OIDC provider)
- 🔑 Passkey (FIDO2/WebAuthn) registration flow
- 💅 Tailwind CSS + Dark Mode
- 🎞 Smooth UI transitions with Framer Motion
- ⚙️ Dynamic OIDC config via `config.json`
- ✅ Session handling, protected routes

---

## 📦 Tech Stack

- React + TypeScript
- Tailwind CSS + Framer Motion
- react-oidc-context
- WebAuthn
- Axios

---

## 🛠 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-org/user-portal.git
cd user-portal
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Configure OIDC

Edit the `public/config.json`:

```json
{
  "providers": {
    "dev": {
      "issuer": "https://localhost:9443/oauth2",
      "client_id": "your-client-id",
      "redirect_uri": "http://localhost:3000/callback",
      "post_logout_redirect_uri": "http://localhost:3000/login",
      "silent_redirect_uri": "http://localhost:3000/silent-renew",
      "scope": "openid profile email"
    }
  },
  "defaultProvider": "dev"
}
```

> 💡 Make sure the client ID and redirect URIs are registered in your Identity Provider.

---

### 4. Start the app

```bash
yarn start
```

Then visit:  
📍 [http://localhost:3000](http://localhost:3000)
