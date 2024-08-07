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
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      `SELECT "provincename", "2007", "2011", "2015", "2021", "2022", "2023", "provinceid"
       FROM provinces
       ORDER BY "2023" DESC`
    );
    const dbprovinces = result.rows;
    res.status(200).json(dbprovinces);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: "Error at the Backend"});
  } finally {
    if(client) client.release();
  }
})

app.get("/serversendprovincedetails/:idpro", async (req, res) => {
  const { idpro } = req.params;
  let client;
  if(!idpro) {
    return res.status(404).json({message: "City id is required"});
  }

  try {
    client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM provinces WHERE provinceid = $1`, [idpro]
    );
    const provinceDetails = await result.rows[0];
    if(!provinceDetails) {
      return res.status(404).json({ message: "City details not found although city id is correct"})
    }
    res.status(200).json(provinceDetails);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: "Error at the Backend: Couldnt fetch province details"})
  } finally {
    if(client) client.release();
  }
});

app.get("/serversendprovincedistrictdetails/:idpro", async (req, res) => {
  let client;
  const { idpro } = req.params;
  if (!idpro) {
    return res.status(400).json({ message: "Province ID is required" });
  }

  try {
    client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM test WHERE provinceid = $1`, [idpro]
    );
    const provinceDetails = result.rows;
    if (provinceDetails.length === 0) {
      return res.status(404).json({ message: "No data found for the provided province ID" });
    }
    res.json(provinceDetails);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occurred at the backend: Could not fetch province district details" });
  } finally {
    if(client) client.release();
  }
});

app.get("/serversenddistrictdetails/:iddist", async (req, res) => {
  let client;
  const { iddist } = req.params;
  if(!iddist) { 
    return res.status(400).json({ message: "District id is required"});
  }
  try {
    client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM test WHERE id = $1`, [iddist]
    );
    //Here we will get only one row. So no need to say rows[0] but I think it will become quicker if I add this
    const districtDetails = result.rows[0];
    if(!districtDetails) {
      return res.status(404).json({ message: "District details not found although district id is correct"})
    }
    res.json(districtDetails);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error: Maybe district id is wrong or database is down"});
  } finally {
    if(client) client.release();
  }
});

app.post("/serversavecomment", async (req, res) => {
  let client;
  const newComment = req.body;
  const {provinceId, name, text, date} = newComment;
  
  
  // Input checks to prevent user mistakes
  if (!provinceId || !name || !text || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (typeof provinceId !== 'number') {
    return res.status(400).json({ message: "provinceId must be a number" });
  }
  if (typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ message: "Name must be a non-empty string" });
  }
  if (typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ message: "Text must be a non-empty string" });
  }
  if (isNaN(Date.parse(date))) {
    return res.status(400).json({ message: "Date must be a valid date" });
  }

  try {
    client = await pool.connect();
    const result = await client.query(
      `INSERT INTO comments (provinceid, date, name, comment) values ($1, $2, $3, $4)`, [provinceId, date, name, text]
    );
    res.status(201).json({message: "Yorum kaydedildi"});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: "Error while saving comment"})
  } finally {
    if(client) client.release();
  }
});
app.post("/serversavecommentreply", async (req, res) => {
  let client;
  const newComment = req.body;
  const {provinceId, name, text, date, commentId} = newComment;
  
  
  // Input checks to prevent user mistakes
  if (!provinceId || !name || !text || !date || !commentId) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (typeof provinceId !== 'number') {
    return res.status(400).json({ message: "provinceId must be a number" });
  }
  if (typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ message: "Name must be a non-empty string" });
  }
  if (typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ message: "Text must be a non-empty string" });
  }
  if (isNaN(Date.parse(date))) {
    return res.status(400).json({ message: "Date must be a valid date" });
  }

  try {
    client = await pool.connect();
    const result = await client.query(
      `INSERT INTO comments (provinceid, date, name, comment, parent_id) values ($1, $2, $3, $4, $5)`, 
      [provinceId, date, name, text, commentId]
    );
    res.status(201).json({message: "Cevap kaydedildi"});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: "Error while saving reply"})
  } finally {
    if(client) client.release();
  }
});

app.get("/servergetcomments/:idpro", async (req, res) => {
  let client;
  const { idpro } = req.params;
  try {
    client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM comments WHERE provinceid = $1 ORDER BY id DESC`, [idpro]
    );
    const allComments = result.rows;
    res.status(200).json(allComments);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: "Error while saving comment"})
  } finally {
    if(client) client.release();
  }
})

app.get("/servergetforeigners/:idpro", async (req, res) => {
  let client;
  const { idpro } = req.params;
  if(!idpro) {
    return res.status(404).json({message: "City id is required"});
  }

  try {
    client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM foreignerstable WHERE provinceid = $1`, [idpro]
    );
    const provinceForeigners = await result.rows[0];
    if(!provinceForeigners) {
      return res.status(404).json({ message: "City details not found although city id is correct"})
    }
    res.status(200).json(provinceForeigners);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: "Error at the Backend: Couldnt fetch province details"})
  } finally {
    if(client) client.release();
  }
});

app.get("/servergetprovinceorigins/:idpro", async (req, res) => {
  let client;
  const { idpro } = req.params;
  if (!idpro) {
    return res.status(404).json({ message: "City id is required" });
  }
  try {
    client = await pool.connect();
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

    if (!combinedData || combinedData.length === 0) {
      return res.status(404).json({ message: "City details not found although city id is correct" });
    }
    res.status(200).json(combinedData);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error at the Backend: Couldnt fetch province details" });
  } finally {
    if(client) client.release();
  }
});

app.get("/servergetinternational", async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM international`
    );
    const dbprovinces = result.rows;
    res.status(200).json(dbprovinces);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: "Error at the Backend while fetching international migration data"});
  } finally {
    if(client) client.release();
  }
});

//A temporary cache to save ip addresses and it will prevent saving same ip addresses for 1 hour.
//I can do that by checking each ip with database ip addresses but then it will be too many requests to db
//We will save each visitor data to database. 
const ipCache = {}
app.post("/serversavevisitor", async (req, res) => {
  const ipVisitor = req.ip;
  let client;
  // Check if IP exists in cache and if last visit was less than 1 hour ago
  if (ipCache[ipVisitor] && Date.now() - ipCache[ipVisitor] < 3600000) {
    return res.status(429).json({message: 'Too many requests from this IP. Please try again later.'});
  }
  ipCache[ipVisitor] = Date.now();//save visitor ip to ipCache
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
    client = await pool.connect();
    const result = await client.query(
      `INSERT INTO visitor_log (ip, op, browser, date, timestamp) 
      VALUES ($1, $2, $3, $4, $5)`, [visitorData.ip, visitorData.os, visitorData.browser, visitorData.visitDate, visitorData.visitTime]
    );
    res.status(200).json({message: "Visitor IP successfully logged"});
  } catch (error) {
    console.error('Error logging visit:', error);
    res.status(500).json({message: 'Error logging visit'});
  } finally {
    if(client) client.release();
  }
})


const PORT = process.env.port || 5000;
app.listen(PORT, () => {
  console.log("Port is open on " + PORT);
});


//Maybe you can add comment section for provinces also and also a like option and answer option
//Maybe a donate section?
//better error management
//later add an ip anaylzer to see which country visited
//Make sure the tables shrink with mobile size screen

//remove "build" from gitignore before production deployment
//create "build" folder
//You can remove cors before production
//Fix server api routes before production, remove "localhost" part
//add environment variables
//