const express = require("express");
const app = express();

const { pool } = require("./db");
const useragent = require('useragent');
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

//add some input checks here to prevent user mistakes
app.post("/serversavecomment", async (req, res) => {
  const newComment = req.body;
  const {provinceId, name, text, date} = newComment;
  try {
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO comments (provinceid, date, name, comment) values ($1, $2, $3, $4)`, [provinceId, date, name, text]
    );
    res.status(201).json({message: "Yorum kaydedildi"});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: "Error while saving comment"})
  }
})

app.get("/servergetcomments/:idpro", async (req, res) => {
  const { idpro } = req.params;
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM comments WHERE provinceid = $1 ORDER BY id DESC`, [idpro]
    );
    const allComments = result.rows;
    client.release();
    res.status(200).json(allComments);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: "Error while saving comment"})
  }
})

app.get("/servergetforeigners/:idpro", async (req, res) => {
  const { idpro } = req.params;
  if(!idpro) {
    return res.status(404).json({message: "City id is required"});
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM foreignerstable WHERE provinceid = $1`, [idpro]
    );
    const provinceForeigners = await result.rows[0];
    client.release();
    if(!provinceForeigners) {
      return res.status(404).json({ message: "City details not found although city id is correct"})
    }
    res.status(200).json(provinceForeigners);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: "Error at the Backend: Couldnt fetch province details"})
  }
});

app.get("/servergetprovinceorigins/:idpro", async (req, res) => {
  const { idpro } = req.params;
  if (!idpro) {
    return res.status(404).json({ message: "City id is required" });
  }
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM origins WHERE provinceid = $1', [idpro]
    );
    const provinceOrigins = result.rows;

    //People from a province list is unorganized. Here we are organizing it from big to small.
    //Separate keys that are containing population
    //Then sort the keys by their values from big to small.
    const provinceOrigins2 = result.rows[0];
    const { provinceid, provincename, ...rest } = provinceOrigins2;
    const basicInfo = { provinceid, provincename };
    const populationData = rest;

    // Convert object to an array of key-value pairs
    const dataArray = Object.entries(populationData);
    // Sort the array by numeric value in descending order
    dataArray.sort((a, b) => Number(b[1]) - Number(a[1]));
    // Convert back to an object
    const sortedList = Object.fromEntries(dataArray);

    //Also lets send total number of people from a region
    const totalPopulation = Object.values(sortedList).reduce((acc, value) => acc + Number(value), 0);

    //I am adding array brackets here because frontend needs it in an array
    const combinedData = [{ ...basicInfo, originPopulation: totalPopulation, ...sortedList }];

    client.release();
    if (!combinedData || combinedData.length === 0) {
      return res.status(404).json({ message: "City details not found although city id is correct" });
    }
    res.status(200).json(combinedData);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error at the Backend: Couldnt fetch province details" });
  }
});

app.get("/servergetinternational", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM international`
    );
    const dbprovinces = result.rows;
    client.release();
    res.status(200).json(dbprovinces);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: "Error at the Backend while fetching international data"});
  }
});

//A temporary cache to save ip addresses and it will prevent saving same ip addresses for 1 hour.
//I can do that by checking each ip with database ip addresses but then it will be too many requests to db
//We will save each visitor data to database. 
const ipCache = {}
app.post("/serversavevisitor", async (req, res) => {
  const ipVisitor = req.ip;
  
  // Check if IP exists in cache and if last visit was less than 1 hour ago
  if (ipCache[ipVisitor] && Date.now() - ipCache[ipVisitor] < 3600000) {
    return res.status(429).json({message: 'Too many requests from this IP. Please try again later.'});
  }
  const userAgentString = req.get('User-Agent');
  const agent = useragent.parse(userAgentString);

  try {
    const visitorData = {
      ip: ipVisitor,
      os: agent.os.toString(), // operating system
      browser: agent.toAgent(), // browser
      visitDate: new Date().toLocaleDateString('en-GB'),
      visitTime: new Date()
    };
    //save visitor to database
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO visitor_log (ip, op, browser, date, timestamp) 
      VALUES ($1, $2, $3, $4, $5)`, [visitorData.ip, visitorData.os, visitorData.browser, visitorData.visitDate, visitorData.visitTime]
    );
    client.release();
    ipCache[ipVisitor] = Date.now();//save visitor ip to ipCache
    res.status(200).json({message: "Visitor IP successfully logged"});
  } catch (error) {
    console.error('Error logging visit:', error);
    res.status(500).json({message: 'Error logging visit'});
  }
})


const PORT = process.env.port || 5000;
app.listen(PORT, () => {
  console.log("Port is open on " + PORT);
});

//Add loading logic to all tables
//create a comment section and place it under all components
//Later, can you also create a comment database for eumaps?
//Create a bottom section that will contain about
//Maybe a donate section?
//Also integrate website visitor counter - How to make visitor counter faster? Maybe I can play with async ?
//comment upvote downvote
//better error management
//