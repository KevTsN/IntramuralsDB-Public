import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

import {leagues, availableLeagues,playerByID, players, 
    studentByID, students, studentTeams, checkLogin, 
    teamByID, teams,
    registerStudent, updateTeam,
    studentJoinTeam, studentLeaveTeam,
    createTeam, teamsByLeague, deleteTeam, 
    studentsInTeam,
    addJoinRequest, 
    deleteJoinRequest, addPlayerByReq,
    getJoinRequestsByStudent,
    getJoinRequestsByTeam} from "./src/routes copy.js"
    
  app.post("/students", registerStudent);
  app.post("/teams", createTeam)
  app.post("/players", studentJoinTeam);

  app.delete("/players", studentLeaveTeam);
  app.delete("/teams", deleteTeam)

  app.get("/players", players);
  app.get("/leagues", leagues);
  app.get("/teams", teams)
  app.get("/students", students)
  app.get("/teams/league/:id", teamsByLeague)
  app.get("/players/:id", playerByID);
  app.get("/students/:id", studentByID);
  app.get("/teams/:id",teamByID)

  app.get("/teams/student/:id", studentTeams);
  app.get("/leagues/student/:id", availableLeagues);


  app.get("/students/:id/&password=:password", checkLogin);

  app.get("/players/team/:id", studentsInTeam)
  
  app.put("/teams/:id", updateTeam)

  app.post("/requests", addJoinRequest)
  app.delete("/requests", deleteJoinRequest)
  app.get("/student/requests/:id", getJoinRequestsByStudent)
  app.get("/team/:id/requests/", getJoinRequestsByTeam)

  app.put("/requests", addPlayerByReq)
  
  app.listen(8800, () => {
    console.log("Connected to backend.");
  });