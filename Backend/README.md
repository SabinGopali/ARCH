## Backend setup

1) Install dependencies

```bash
npm i
```

2) Configure environment

Copy `.env.example` to `.env` and fill the values:

```bash
cp .env.example .env
```

Required:
- `MONGO_URI` (e.g. `mongodb://127.0.0.1:27017/emailAuthSystem` or your MongoDB Atlas URI)
- `JWT_SECRET`
- `SMTP_EMAIL` and `SMTP_PASS` (Gmail app password)

Optional for SMS OTP:
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`

Optional:
- `FRONTEND_ORIGIN` for CORS (defaults to `http://localhost:5173`)

3) Run server

```bash
npm run dev
```

The server loads `.env` from project root or `Backend/.env` automatically and connects to `MONGO_URI`.
