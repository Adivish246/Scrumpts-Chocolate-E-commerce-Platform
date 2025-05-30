# 🍫 Scrumpts - Chocolate E-commerce Platform

A full-stack chocolate e-commerce application built with modern web technologies including Vite, TypeScript, Tailwind CSS, Drizzle ORM, and Express.

## 📦 Tech Stack

* **Frontend:** Vite, React (with Radix UI), TypeScript, Tailwind CSS
* **Backend:** Express (Node.js)
* **Database:** PostgreSQL with Drizzle ORM
* **Deployment:** Replit-compatible, with NEON DB integration
* **Package Manager:** npm

## ✨ Features

* User-friendly chocolate shopping interface
* Product cards, detail pages, and cart components
* Modular, component-based architecture
* Form validation with React Hook Form and Zod
* Optimized for fast builds with Vite + ESBuild
* NEON database ready for production

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/scrumpts-ecommerce.git
cd scrumpts
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file based on `.env.example` or configure your `NEON` PostgreSQL connection string.

```env
DATABASE_URL=your_neon_db_url
```

### 4. Database Initialization

```bash
npm run db:init
```

### 5. Start Development Server

```bash
npm run dev
```

Access it at `http://localhost:3000`

## 📁 Project Structure

```
Scrumpts/
├── server/                 # Express + Drizzle backend code
├── components/             # React component files
├── tailwind.config.ts      # Tailwind CSS config
├── drizzle.config.ts       # Drizzle ORM config
├── .env                    # Environment variables
├── package.json            # Project metadata and scripts
└── vite.config.ts          # Vite build configuration
```

## 🧪 Available Scripts

```bash
npm run dev            # Start dev server
npm run build          # Build frontend and backend
npm start              # Start production server
npm run db:init        # Initialize database schema
npm run db:push        # Push schema to NEON
npm run db:reseed      # Reseed data for testing
```

## 📖 Documentation

* Refer to `NEON_SETUP.md` for detailed instructions on setting up the PostgreSQL database.
* See `Scrumpts-Chocolate-E-commerce-Platform.pptx` for a presentation overview.
* See `*.pdf` file for the detailed project report.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Would you like me to generate a `LICENSE` file or `requirements.txt` equivalent (`package.json` already included)?
