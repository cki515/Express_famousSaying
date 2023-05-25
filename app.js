import express from "express";
import mysql from "mysql2/promise";

const app = express();
const port = 3002;

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: "3307",
  password: "",
  database: "famous_saying",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/famous_saying", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM famous_saying ORDER BY id DESC"
  );
  res.json(rows);
});

app.get("/famous_saying/:id", async (req, res) => {
  const { id } = req.params;
  const [row] = await pool.query("SELECT * FROM famous_saying WHERE id=?", [
    id,
  ]);
  if (row.length == 0) {
    res.status(404).send("Page is not found");
    return;
  }
  res.json(row);
});

app.get("/about", (req, res) => {
  res.send("About!");
});

app.get("/setting", (req, res) => {
  res.send("Setting!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
