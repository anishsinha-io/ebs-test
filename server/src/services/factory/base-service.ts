import app from "../../app";
import format from "pg-format";

export default class BaseService {
  constructor(protected table: string) {}
  public async read(id: string) {
    try {
      const query = format("SELECT * FROM %I WHERE id = $1", this.table);
      const res = await app.pool.query(query, [id]);
      return res.rows[0];
    } catch (e) {
      console.log(`error reading one from table ${this.table}: ${e}`);
    }
  }
  public async readAll() {
    try {
      const query = format("SELECT * FROM %I", this.table);
      const res = await app.pool.query(query);
      return res.rows;
    } catch (e) {
      console.log(`error reading all from table ${this.table}: ${e}`);
    }
  }
  public async delete(id: string) {
    try {
      const query = format("DELETE FROM %I WHERE id = $1", this.table);
      const res = await app.pool.query(query, [id]);
      return res.rows[0];
    } catch (e) {
      console.log(`error reading all from table ${this.table}: ${e}`);
    }
  }
}
