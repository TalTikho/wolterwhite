# 📖 WOLTerWhite — Grader Documentation

This folder contains everything needed to run and verify the full WOLTerWhite system as a grader.

---

## 📋 Pages

| Page | What it covers |
| ------ | ---------------- |
| [Environment Startup](environment-startup.md) | How to boot the full stack — Docker (web + backend) and the mobile app (Android emulator) |
| [Login & Registration](login-registration.md) | Auth flow walkthrough for both web and mobile, including admin vs regular user differences |
| [CRUD Walkthrough](crud-walkthrough.md) | Step-by-step create/edit/delete for restaurants, products, and orders across web and mobile |

---

## ⚡ TL;DR for Graders

```bash
# 1. Start the backend + web
docker-compose up --build

# 2. Create mobile/services/apiConfig.ts (see environment-startup.md)

# 3. Start the mobile app
cd mobile && npm install && npx expo start --tunnel
# Press 'a' for Android emulator
```

- Web: `http://localhost:3000`
- API: `http://localhost:5000`
- Default admin credentials are in [login-registration.md](login-registration.md)
