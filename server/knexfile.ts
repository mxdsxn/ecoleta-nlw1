import path from "path";

module.exports = {
  client: "mysql2",
  connection: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "nwl_1",
  },
  migrations: {
    directory: path.resolve(__dirname, "src", "database", "migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "src", "database", "seeds"),
  },
  useNullAsDefault: true,
};
