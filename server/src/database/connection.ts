import knex from "knex";
import path from "path";

const conn = knex({
  client: "mysql2",
  connection: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "nwl_1",
  },
});

export default conn;

//migrations: historico do banco de dados
