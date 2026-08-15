# Passage — Home Rental Platform for Foreigners in India

> **Goal**: A production-ready, full-stack Home Rental Platform tailored for international travelers, expats, digital nomads, and foreigners looking for verified, hassle-free rental properties across India.

---

## 🌟 Key Features

- **Multi-City Database**: 56+ verified properties pre-seeded across 8 major Indian cities:
  - **Chennai** (R.A. Puram, Nungambakkam, Boat Club, ECR)
  - **Bangalore** (Koramangala, Indiranagar, Whitefield, Lavelle Road)
  - **Mumbai** (Bandra West, Juhu, Colaba, Worli)
  - **Delhi** (Golf Links, Vasant Vihar, Defense Colony)
  - **Hyderabad** (Jubilee Hills, Gachibowli, HITEC City)
  - **Goa** (Ashwem Beach, Anjuna, Candolim, Assagao)
  - **Kochi** (Fort Kochi, Marine Drive)
  - **Jaipur** (C-Scheme, Malviya Nagar)
- **10+ Property Types**: Penthouses, Executive Lofts, Sea-Facing Villas, Heritage Homes, Studios, Serviced Apartments, Eco Bungalows, Skyline Suites, Co-living Hubs.
- **FRRO Visa Paperwork Support**: Landlord-tenant lease agreements pre-configured for Indian online Form C registration.
- **Multi-Currency Engine**: Live dynamic price conversion between **INR (base)**, **USD**, **EUR**, **GBP**, **AUD**, **CAD**, **SGD**, and **JPY**.
- **AI Relocation Concierge**: Natural language chat AI assistant powered by Gemini / OpenAI with rule-based fallback for finding homes near IT parks, explaining visa rules, and scheduling 4K video tours.
- **Payment Architecture**: Support for Razorpay & Stripe integration with mock/test mode fallback and Passage Escrow protection.
- **Passport & Visa Vault**: Secure file upload for foreigners with role-gated admin verification queue (`pending`, `verified`, `rejected`).
- **3 User Dashboards**:
  - **Foreigner / Customer**: Search, advanced filters, date booking, multi-currency payment, wishlist, passport upload, review submission.
  - **Property Owner / Landlord**: Listing creation, edit/delete, availability calendar blocking, booking request approvals, customer details viewer, revenue analytics.
  - **Admin Control Center**: Platform metrics, property approval queue, user management, document verification queue, complaints panel, featured listing toggles.

---

## 🛠 Tech Stack

- **Frontend**: React 18 + Tailwind CSS (No Vite used)
- **Backend**: Node.js + Express.js + Mongoose
- **Database**: MongoDB (with zero-configuration MongoDB Memory Server fallback)
- **Authentication**: JWT & Role-Based Authorization (`tenant`, `owner`, `admin`)
- **Maps**: Leaflet.js / OpenStreetMap with Google Maps API readiness
- **Payments**: Razorpay & Stripe test architecture

---

## 🔑 Demo Login Credentials

All seed accounts use the password: `tenant123` / `owner123` / `admin123`

| User Role | Email | Password | Details |
|---|---|---|---|
| **Foreign Expat (Tenant)** | `tenant@passage.com` | `tenant123` | German Expat with verified passport |
| **Foreign Expat (Tenant)** | `daniel@passage.com` | `tenant123` | Nigerian Expat tenant |
| **Property Owner (Host)** | `owner@passage.com` | `owner123` | Landlord with multiple metro listings |
| **Platform Admin** | `admin@passage.com` | `admin123` | Full system control & verification queue |

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Database
Runs the seed script generating 56+ properties, users, currency exchange rates, bookings, reviews, and passport documents:
```bash
npm run seed
```

### 3. Start Server
Starts the Express server on port `5000`:
```bash
npm start
```

Visit the application at: **`http://localhost:5000`**

---

## ☁️ Production Deployment Options

Passage is deployment-ready with configuration files for instant 1-click cloud hosting:

### Option 1: Netlify Deployment (Serverless Functions)
1. Push this repository to GitHub.
2. Log in to [Netlify.com](https://netlify.com) and click **Add new site > Import an existing project**.
3. Select your GitHub repository. Netlify automatically reads [`netlify.toml`](netlify.toml) and [`netlify/functions/server.js`](netlify/functions/server.js).
4. Build command: leave empty or `npm install`.
5. Publish directory: `public`.
6. Click **Deploy Site**. Your live website URL will be created (e.g. `https://passage-rental.netlify.app`).

### Option 2: Render.com (Recommended Full-Stack Hosting)
1. Log in to [Render.com](https://render.com) and click **New > Web Service**.
2. Connect your repository. Render automatically reads [`render.yaml`](render.yaml).
3. Click **Deploy**. Your live site URL will be generated (e.g. `https://passage-rental.onrender.com`).

### Option 3: Railway.app / Heroku / Docker
- Railway & Heroku use [`Procfile`](Procfile). Docker containers use [`Dockerfile`](Dockerfile).

---

## 📁 Project Structure

```
passage-rental/
├── config/
│   └── db.js                 # MongoDB connection & Memory Server fallback
├── middleware/
│   └── authMiddleware.js     # JWT protection & role authorization
├── models/
│   ├── User.js               # Tenant, Owner, Admin schemas
│   ├── Property.js           # Extended property schema with 8 cities & 10+ types
│   ├── Booking.js            # Booking dates, amounts, status
│   ├── Payment.js            # Razorpay / Stripe transaction records
│   ├── Document.js           # Passport & Visa document metadata
│   ├── Review.js             # Multi-criterion reviews
│   ├── CurrencyRate.js       # Exchange rate dataset
│   └── Notification.js       # In-app notifications
├── routes/
│   ├── authRoutes.js         # Register, Login, Profile
│   ├── propertyRoutes.js     # Search, Filters, Property CRUD
│   ├── bookingRoutes.js      # Double-booking check & booking creation
│   ├── paymentRoutes.js      # Gateway integration
│   ├── documentRoutes.js     # Passport file upload
│   ├── currencyRoutes.js     # Exchange rate API
│   ├── aiRoutes.js           # AI chat & property recommendation
│   └── adminRoutes.js        # Admin metrics & approval queue
├── public/
│   ├── index.html            # Single page app container
│   └── js/
│       ├── api.js            # Passage API Client
│       ├── App.jsx           # Root React app & navigation router
│       ├── components/       # Navbar, Footer, PropertyCard, AIAssistantModal
│       └── pages/            # 26 Main Pages (Home, Search, Detail, Owner, Admin...)
├── seed.js                   # Seeding entry point
├── seedDataHelper.js         # 56+ property dataset generator
├── server.js                 # Express server
├── Procfile                  # Deployment config for Heroku / Render / Railway
├── render.yaml               # 1-click Render.com deployment manifest
├── vercel.json               # Vercel deployment manifest
├── Dockerfile                # Docker container configuration
├── .env.example              # Environment variables template
└── README.md                 # Setup & documentation
```
