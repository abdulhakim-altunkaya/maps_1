const express = require("express");
const app = express();

const { pool } = require("./db");

const cors = require("cors");
app.use(cors());

app.get("/serversendhello", (req, res) => {
  res.status(200).json({myMessage: "Hello from backend"});
})


app.get("/servercreatetable1", async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      CREATE TABLE IF NOT EXISTS population (
        "province" TEXT,
        "id" TEXT,
        "2000" INTEGER,
        "2001" INTEGER, 
        "2002" INTEGER,
        "2003" INTEGER,
        "2004" INTEGER, 
        "2005" INTEGER,
        "2006" INTEGER,
        "2007" INTEGER, 
        "2008" INTEGER,
        "2009" INTEGER,
        "2010" INTEGER, 
        "2011" INTEGER,
        "2012" INTEGER,
        "2013" INTEGER, 
        "2014" INTEGER,
        "2015" INTEGER,
        "2016" INTEGER, 
        "2017" INTEGER,
        "2018" INTEGER,
        "2019" INTEGER, 
        "2020" INTEGER,
        "2021" INTEGER,
        "2022" INTEGER, 
        "2023" INTEGER
      );
    `)
    client.release();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ myMessage: "table creation failed"});
  }
})

const PORT = process.env.port || 5000;
app.listen(PORT, () => {
  console.log("Port is open on " + PORT);
});