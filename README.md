# Modern Dashboard Project

A modern full-stack dashboard application built with **React** (frontend) and **Laravel** (backend).

## 📁 Project Structure

```
Dashboard/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── backend/           # Laravel backend
    ├── app/
    ├── routes/
    ├── database/
    └── ...
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **PHP** (v8.2 or higher)
- **Composer**
- **npm** or **yarn**

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies (already done):
   ```bash
   composer install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. Set up your database in `.env` file

5. Run migrations:
   ```bash
   php artisan migrate
   ```

6. Start the development server:
   ```bash
   php artisan serve
   ```

   The backend will run on `http://localhost:8000`

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI library
- **Vite 6.0** - Build tool and dev server
- **Modern CSS** - Styling with glassmorphism effects

### Backend
- **Laravel 12** - PHP framework
- **SQLite** - Database (default, can be changed)

## 📝 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `php artisan serve` - Start development server
- `php artisan migrate` - Run database migrations
- `php artisan test` - Run tests

## 🔗 API Integration

The frontend is configured to proxy API requests to the Laravel backend:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API calls from frontend to `/api/*` will be proxied to the backend

## 🎨 Features

- ✅ Modern, responsive design
- ✅ Glassmorphism UI effects
- ✅ Gradient animations
- ✅ React state management
- ✅ Laravel API backend
- ✅ Hot module replacement (HMR)
- ✅ API proxy configuration

## 📦 What's Installed

### Frontend Dependencies
- `react` & `react-dom` - Core React libraries
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite

### Backend Dependencies
- Laravel framework with all standard packages
- PHPUnit for testing
- Laravel Sail for Docker support (optional)

## 🚧 Next Steps

1. **Configure CORS** in Laravel for API access
2. **Create API routes** in `backend/routes/api.php`
3. **Build dashboard components** in `frontend/src/components/`
4. **Set up authentication** (Laravel Sanctum recommended)
5. **Add state management** (Redux, Zustand, or Context API)
6. **Configure database** for production use

## 📄 License

This project is open-source and available under the MIT License.
