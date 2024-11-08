import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

import {leagues, playerByID, players, 
    studentByID, students, studentTeams, checkLogin, 
    teamByID, teams,
    registerStudent,
    studentJoinTeam, studentLeaveTeam} from "./src/routes.js"

  app.get("/players", players);
  app.get("/leagues", leagues);
  app.get("/teams", teams)
  app.get("/students", students)

  app.get("/players/:id", playerByID);
  app.get("/students/:id", studentByID);
  app.get("/teams/:id",teamByID)

  app.get("/teams/student/:id", studentTeams);

  app.get("/students/:id/&password=:password", checkLogin);
  app.post("/students", registerStudent);

  app.post("/players", studentJoinTeam);
  app.delete("/players", studentLeaveTeam);


app.listen(8800, () => {
    console.log("Connected to backend.");
  });