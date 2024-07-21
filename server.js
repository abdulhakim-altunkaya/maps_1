const express = require("express");
const app = express();

const { pool } = require("./db");

const cors = require("cors");
app.use(cors());

//we need this as we use req.body to send data from frontend to backend
app.use(express.json());

app.get("/serversendhello", (req, res) => {
  res.status(200).json({myMessage: "Hello from backend"});
})

app.get("/servergetprovinces", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT "provincename", "2007", "2011", "2015", "2021", "2022", "2023", "provinceid"
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
      `SELECT * FROM provinces WHERE provinceid = $1`, [idpro]
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

app.get("/serversendprovincedistrictdetails/:idpro", async (req, res) => {
  const { idpro } = req.params;
  if (!idpro) {
    return res.status(400).json({ message: "Province ID is required" });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM test WHERE provinceid = $1`, [idpro]
    );
    const provinceDetails = result.rows;
    client.release();
    if (provinceDetails.length === 0) {
      return res.status(404).json({ message: "No data found for the provided province ID" });
    }
    res.json(provinceDetails);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occurred at the backend: Could not fetch province district details" });
  }
});

app.get("/serversenddistrictdetails/:iddist", async (req, res) => {
  const { iddist } = req.params;
  if(!iddist) { 
    return res.status(400).json({ message: "District id is required"});
  }
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM test WHERE id = $1`, [iddist]
    );
    //Here we will get only one row. So no need to say rows[0] but I think it will become quicker if I add this
    const districtDetails = result.rows[0];
    client.release();
    if(!districtDetails) {
      return res.status(404).json({ message: "District details not found although district id is correct"})
    }
    res.json(districtDetails);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error: Maybe district id is wrong or database is down"});
  }
});

app.post("/serversavecomment", async (req, res) => {
  const newComment = req.body;
  const {name, text, date} = newComment;
  try {
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO comments (date, name, comment) values ($1, $2, $3)`, [date, name, text]
    );
    res.status(201).json({message: "Yorum kaydedildi"});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: "Error while saving comment"})
  }
})


const PORT = process.env.port || 5000;
app.listen(PORT, () => {
  console.log("Port is open on " + PORT);
});

//implement a settimeout for all components
//create a comment section and place it under all components
//Later, can you also create a comment database for eumaps?
//