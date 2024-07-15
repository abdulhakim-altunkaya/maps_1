const express = require("express");
const app = express();

const { pool } = require("./db");

const cors = require("cors");
app.use(cors());

app.get("/serversendhello", (req, res) => {
  res.status(200).json({myMessage: "Hello from backend"});
})

app.get("/servergetprovinces", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT "provincename", "2007", "2011", "2015", "2021", "2022", "2023"
       FROM provinces
       ORDER BY "2023" DESC`
    );
    const dbprovinces = result.rows;
    client.release();
    res.status(200).json(dbprovinces);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: "Error at the Backend"});
  }
})

app.get("/serversendprovincedetails/:idpro", async (req, res) => {
  const { idpro } = req.params;
  if(!idpro) {
    return res.status(404).json({message: "City id is required"});
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM provinces WHERE provinceid = $1`, [ idpro ]
    );
    const provinceDetails = await result.rows[0];
    client.release();
    if(!provinceDetails) {
      return res.status(404).json({ message: "City details not found although city id is correct"})
    }
    res.status(200).json(provinceDetails);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: "Error at the Backend: Couldnt fetch province details"})
  }
});


const PORT = process.env.port || 5000;
app.listen(PORT, () => {
  console.log("Port is open on " + PORT);
});
