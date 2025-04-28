import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import env from "dotenv";
import {rateLimit} from "express-rate-limit";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
env.config();
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	
})


app.use(limiter);

const token = process.env.TOKEN;
app.set('view engine', 'ejs');


app.get("/", async (req, res) => {
    res.render("index.ejs");
  
})

app.post("/submit", async (req, res) => {
    const search = req.body.userPrompt;
    try {
    
        const response = await axios.get(`http://api.genius.com/search?q=${search}&access_token=${token}`);
       

        res.render("index.ejs", {content: response.data.response.hits[0].result.url});
      } catch (error) {
        console.error(error);
        res.render("index.ejs", {err: error});
      }
})

if (process.env.NODE_ENV !== 'test') { 
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

export default app; 