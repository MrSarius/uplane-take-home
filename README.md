# 📷 Image Processor - Full Stack Application

A full-stack application that allows users to **upload images**, process them through **background removal** and **horizontal flipping**, and manage the resulting images.

---

## 🚀 Live Demo

- 🌐 **Frontend (Vercel):** [uplane-take-home-um3s.vercel.app](https://uplane-take-home-um3s.vercel.app/)  
- ⚙️ **Backend (Railway):** [uplane-take-home-production.up.railway.app](https://uplane-take-home-production.up.railway.app)

---

## ⚡ Environment Variables

👉 Create a **`.env` file** inside both the **frontend** and **backend** folders and place the required variables there.

### 🔹 Frontend (`.env`)
```env
REACT_APP_API_URL=<backend_api_url>
```

### 🔹 Backend (`.env`)
```env
PORT=<your_port>
NODE_ENV=<development_or_production>
REMOVE_BG_API_KEY=<your_remove_bg_api_key>
```