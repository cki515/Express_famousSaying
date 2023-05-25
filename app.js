import express from "express";
import mysql from "mysql2/promise";

const app = express();
app.use(express.json());
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

// POST
app.post("/famous_saying", async (req, res) => {
  const { author, content } = req.body;

  if (!author) {
    res.status(400).json({
      msg: "author required",
    });
    return;
  }

  if (!content) {
    res.status(400).json({
      msg: "content required",
    });
    return;
  }

  const [rs] = await pool.query(
    `INSERT INTO famous_saying
     SET reg_date = NOW(),
         content = ?,
         author = ?
    `,
    [content, author]
  );
  res.status(201).json({
    id: rs.insertId,
  });
});

// PATCH
app.patch("/famous_saying/:id", async (req, res) => {
  const { id } = req.params;
  const { content, author } = req.body;

  const [row] = await pool.query("SELECT * FROM famous_saying WHERE id = ?", [
    id,
  ]);

  if (row.length == 0) {
    res.status(404).send("not found");
    return;
  }

  if (!author) {
    res.status(400).json({
      msg: "author required",
    });
    return;
  }

  if (!content) {
    res.status(400).json({
      msg: "content required",
    });
    return;
  }

  const [rs] = await pool.query(
    `
    UPDATE famous_saying
    SET reg_date = NOW(),
        content = ?,
        author = ?
    WHERE id = ?
    `,
    [content, author, id]
  );
  res.status(200).json({
    id,
    author,
    content,
  });
});

// DELETE
app.delete("/famous_saying/:id", async (req, res) => {
  const { id } = req.params;

  const [row] = await pool.query("SELECT * FROM famous_saying WHERE id = ?", [
    id,
  ]);

  if (row.length == 0) {
    res.status(404).send("not found");
    return;
  }

  const [rs] = await pool.query(
    `
    DELETE FROM famous_saying
    WHERE id = ?
    `,
    [id]
  );
  res.status(200).json({
    msg: "Complete Delete",
  });
});

// SELECT
app.get("/famous_saying/:id", async (req, res) => {
  const { id } = req.params;
  const [row] = await pool.query("SELECT * FROM famous_saying WHERE id=?", [
    id,
  ]);
  if (row.length == 0) {
    res.status(404).send("not found");
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
