import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
import { migrate } from "postgres-migrations";
import path from "path";

import userRouter from "./routes/user-router";

dotenv.config({ path: `src/config/.env.dev` });

interface AppEnv {
  readonly pgUser: string;
  readonly pgPass: string;
  readonly pgPort: string;
  readonly pgHost: string;
  readonly pgDb: string;
  readonly serverPort: string;
}

class App {
  public pool: pg.Pool;
  private app;
  private appEnv: AppEnv;
  constructor() {
    this.appEnv = {
      pgUser: process.env.POSTGRES_USER!,
      pgPass: process.env.POSTGRES_PASSWORD!,
      pgPort: process.env.POSTGRES_PORT!,
      pgHost: process.env.POSTGRES_HOST!,
      pgDb: process.env.POSTGRES_DATABASE!,
      serverPort: process.env.SERVER_PORT!,
    };
    this.pool = this.connect();
    this.runMigrations();
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use("/api/users", userRouter);
  }
  public static main(): void {
    const app = new App();
    app.run();
  }
  private async run(): Promise<void> {
    const test: boolean = await this.testConnect();
    if (!test) process.exit(1);
    else console.log(`Successfully connected to PostgreSQL`);
    this.app.listen(this.appEnv.serverPort || 8000, () =>
      console.log(`Server listening on port ${this.appEnv.serverPort || 8000}`)
    );
  }
  private connect(): pg.Pool {
    const pool = new pg.Pool({
      user: this.appEnv.pgUser,
      password: this.appEnv.pgPass,
      database: this.appEnv.pgDb,
      host: this.appEnv.pgHost,
      port: +this.appEnv.pgPort,
    });
    return pool;
  }

  private async testConnect(): Promise<boolean> {
    const ping = await this.pool.query("SELECT NOW()");
    if (!ping.rows[0].now) return false;
    return true;
  }

  private async runMigrations(): Promise<void> {
    const dbConfig = {
      database: this.appEnv.pgDb,
      user: this.appEnv.pgUser,
      password: this.appEnv.pgPass,
      host: this.appEnv.pgHost,
      port: +this.appEnv.pgPort,
    };
    await migrate(dbConfig, `${path.join(__dirname, "../migrations")}`);
  }
}

App.main();

export default new App();
