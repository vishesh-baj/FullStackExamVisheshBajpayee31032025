import helmet from "helmet";
import cors from "cors";
import express, { Express } from "express";

const securityConfig = (app: Express): void => {
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
};

export default securityConfig;
