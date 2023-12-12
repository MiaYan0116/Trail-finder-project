// import * as dotenv from 'dotenv'
// dotenv.config()
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue, Filter } from "firebase-admin/firestore";
import serviceAccount from './serviceAccountKey.json' assert {type: 'json'};
import { Parser } from 'json2csv';
import { spawn } from 'child_process';

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();


const getTrailItemByTrailTitle = async (wishItem) => {
  try {
    let trailArray = [];
    const snapshot = await db.collection('traillist').get();
    snapshot.forEach((doc) => {
      if (doc.data().trailTitle == wishItem.trailTitle) {
        trailArray.push(doc.data());
      }
    });
    return trailArray[0];
  } catch (error) {
    console.error('Error getting trailItem by trailTitle:', wishItem.trailTitle);
  }
}



const getUserByUserAuthId = async (userAuthId) => {
  try {
    let newArray = [];
    const snapshot = await db.collection('users').get();
    snapshot.forEach((doc) => {
      if (doc.data().uid == userAuthId) {
        newArray.push(doc.data());
      }
    });
    console.log(newArray[0]);
    return newArray[0];
  } catch (error) {
    console.error('Error getting user by userAuthId:', error);
  }
};


async function convertToCSV (res, fileName, fields, data) {
  try{
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(data);

    // Save the CSV file to the server or perform any other desired operations
    res.header('Content-Type', 'text/csv');
    res.attachment(fileName);
    return res.send(csv);
  } catch (err) {
    // Handle any errors that might occur during CSV conversion or sending the response
    console.error('Error converting to CSV:', err);
    res.status(500).send('Internal Server Error');
  }
};



//get a csv file of a specific user's wishlist data
app.get("/csv/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const userData =  await getUserByUserAuthId(uid);
    const wishList = userData.wishitems;
    const newTrailList = await Promise.all(
      wishList.map(async (wishItem) => {
        return getTrailItemByTrailTitle(wishItem);
      })
    );
    const fields = ["id", "difficulty", "publicTransit", "dogFriendly", "camping", "rating", "trailTitle"];
    const data = await extractTrailData(newTrailList, fields);
    const csvFile = await convertToCSV(res, "wishlist.csv", fields, data);
    return csvFile;
  } catch (err) {
    console.error('Error retrieving fields:', err);
    res.status(500).send('Error retrieving fields');
  }
})


async function extractTrailData (trailList, fields) {
  //Use Promise.all() to await all the asynchronous tasks inside the map() function.
  const data = await Promise.all(trailList.map(async (trail) => {
    try {
      const extractedData = {[fields[0]]: trail.id, 
        [fields[1]]: trail.difficulty, 
        [fields[2]]: trail.publicTransit,
        [fields[3]]: trail.dogFriendly,
        [fields[4]]: trail.camping,
        [fields[5]]: trail.rating,
        [fields[6]]: trail.trailTitle,};
      console.log(extractedData);
      return extractedData;
    } catch (err) {
      console.error( `Error in extracting trail data`);
    }
  }));
  return data.filter(item => item !== null);
}


//**** get a csv file of all trails' data from Firestore
app.get("/csv_all", async (req, res) => {
  try {
    //const trailList = await prisma.trailItem.findMany();
    let trailList = [];
    const snapshot = await db.collection('traillist').get();
    snapshot.forEach((doc) => {
      trailList.push(doc.data());
    });
    const fields = ["id", "difficulty", "publicTransit", "dogFriendly", "camping", "rating", "trailTitle"];
    const data = await extractTrailData(trailList, fields);
    const csvFile = await convertToCSV(res, "traillist.csv", fields, data);
    return csvFile;
  } catch (err) {
    console.error('Error retrieving fields:', err);
    res.status(500).send('Error retrieving fields');
  }
})


app.get("/recommendation/:uid", async(req, res) => {
  try {
    const uid = req.params.uid;
    console.log("qqqqq");
    const pythonScriptPath = 'recommendationAlgorithm.py';
    const pythonScriptArgs = [uid];
    const pythonProcess = spawn('python', [pythonScriptPath, ...pythonScriptArgs]);
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python script stdout: ${data}`);
      res.status(200).send(data);
    });
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script stderr: ${data}`);
    });
    pythonProcess.on('close', (code) => {
      console.log(`Python script process exited with code ${code}`);
    });
    
  } catch (err) {
    console.error('Error generating recommendation:', err);
    res.status(500).send('Error generating recommendation');
  }
})


 app.listen(8000, () => {
   console.log("Server running on http://localhost:8000 🎉 🚀");
 });

