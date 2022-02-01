import BaseService from "./factory/base-service";
import format from "pg-format";
import app from "../app";

export interface NewUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export class UsersService extends BaseService {
  constructor() {
    super("users");
  }
  public async create(newUser: NewUser) {
    try {
      const { firstName, lastName, username, email, password } = newUser;
      const query = format(
        "INSERT INTO %I (first_name, last_name, email, username, hashed_password) VALUES ($1, $2, $3, $4, $5)",
        this.table
      );
      const res = await app.pool.query(query, [
        firstName,
        lastName,
        email,
        username,
        password,
      ]);
      return res.rows[0];
    } catch (e) {
      console.log(`error creating user: ${e}`);
    }
  }
  public async update(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    username: string
  ) {
    try {
      const query = format(
        "UPDATE %I SET first_name = $1, last_name = $2, email = $3, username = $4 WHERE id = $5",
        this.table
      );
      const res = await app.pool.query(query, [
        firstName,
        lastName,
        email,
        username,
        id,
      ]);
      return res.rows[0];
    } catch (e) {
      console.log(`error updating user: ${e}`);
    }
  }
}

export default new UsersService();
