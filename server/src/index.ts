import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import { PrismaClient } from "@prisma/client"
import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes"
import contactRoutes from "./routes/contactRoutes"
import namedaysRoutes from "./routes/namedaysRoutes"

// Load environment variables
dotenv.config()

// Initialize Prisma Client
export const prisma = new PrismaClient()

// Initialize Express app
const app: Express = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
) // Security headers with CORS compatibility
app.use(
  cors({
    origin:
      process.env.FRONTEND_URL?.split(",") || [
        "http://localhost:3000",
        "http://localhost",
      ],
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
)
app.use(express.json()) // Parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies
app.use(cookieParser()) // Parse cookies

// Serve uploaded files
app.use("/uploads", express.static(process.env.UPLOAD_DIR || "./uploads"))

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Birthday App API is running" })
})

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/contacts", contactRoutes)
app.use("/api/namedays", namedaysRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" })
})

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error("Error:", err)
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Database: ${process.env.DATABASE_URL}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
})

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...")
  await prisma.$disconnect()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  console.log("\nShutting down gracefully...")
  await prisma.$disconnect()
  process.exit(0)
})
