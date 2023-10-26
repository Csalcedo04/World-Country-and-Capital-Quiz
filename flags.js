import express from "express";
import bodyParser from "body-parser";
import pg from "pg"
const router = express.Router();
const app = express();
const port = 5000;

let totalCorrect = 0;
let currentQuestion = {};
let quiz = [];

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "123",
  port: 5432,
});
db.connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

db.query("SELECT * FROM flags", (err, res) =>{
  if (err){
    console.log("Error executing query", err.stack);
  }else{
    quiz = res.rows;
  }
  db.end();
})
// GET home page
app.get("/", (req, res) => {
  totalCorrect = 0;
  nextQuestion();
  console.log(currentQuestion);
  res.render("flags.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.name.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("flags.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
