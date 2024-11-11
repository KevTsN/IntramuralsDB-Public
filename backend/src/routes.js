import mysql from "mysql2"
import dotenv from 'dotenv';
dotenv.config();

var sqlPass = process.env.mySqlPass

const db = mysql.createConnection({
    host:"localhost",
    user: "root",
    password:sqlPass,
    database: "tablecreation"
})

export function leagues(req, res) {
    const q = "SELECT * FROM leagues";
    db.query(q, (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      return res.json(data);
    });
  }

  export function players(req,res){
    const q = "SELECT * FROM players";
    db.query(q, (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      return res.json(data);
    });
  }
  
  export function teams(req,res){
    const q = "SELECT * FROM teams";
    db.query(q, (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      return res.json(data);
    });
  }

  export function students(req,res){
    const q = "SELECT * FROM students";
    db.query(q, (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      return res.json(data);
    });
  }

    export function playerByID (req, res) {
    const playerID = req.params.id;
    const q = " SELECT * FROM players WHERE playerID = ? ";
  
    db.query(q, [playerID], (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
  }

 export function studentByID(req, res) {
    const playerID = req.params.id;
    const q = " SELECT * FROM students WHERE studentID = ? ";
  
    db.query(q, [playerID], (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    })
}

export function teamByID(req, res) {
    const playerID = req.params.id;
    const q = " SELECT * FROM students WHERE teamID = ? ";
  
    db.query(q, [playerID], (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    })
}

  export function studentTeams(req, res) {
    const studentID = req.params.id;
    /*example from Anom on 
    https://stackoverflow.com/questions/13131496/how-to-do-join-on-multiple-criteria-returning-all-combinations-of-both-criteria
    SELECT one.*, two.Meal
    FROM table1 AS one
    LEFT JOIN table2 AS two
        ON (one.WeddingTable = two.WeddingTable AND one.TableSeat = two.TableSeat); */

    const q = `SELECT one.*, three.sport, three.skillLevel, three.genders FROM teams AS one INNER JOIN players AS two ON (one.teamID = two.teamID AND two.studentID = ${studentID}) LEFT JOIN leagues AS three ON (one.leagueID = three.leagueID)`;
  
    db.query(q, (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    })
}

export function availableLeagues(req,res){
  const studentID = req.params.id;
  const q = `SELECT DISTINCT leagues.* from players INNER JOIN teams ON (players.teamID = teams.teamID and players.studentID = ${studentID}) RIGHT JOIN leagues ON (leagues.leagueID = teams.leagueID) where studentID IS NULL and leagues.numTeams<leagues.maxTeams`
  db.query(q,  (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
}

export function checkLogin(req,res){

    const id = req.params.id
    const pw = req.params.password;

    const q = `SELECT studentID, firstName, lastName, gender from students where (studentID = ${id} AND password="${pw}");`
    db.query(q,  (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });


  }

export function registerStudent(req,res){

  
    const values = [
      req.body.studentID,
      req.body.password,
      req.body.gender,
      req.body.firstName,
      req.body.lastName
    ];

    const q = `INSERT INTO students (studentID, password, gender, firstName, lastName)
    values (${values[0]}, "${values[1]}", "${values[2]}", "${values[3]}", "${values[4]}")`;
  
    db.query(q, (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    })

 
}

export function createTeam(req,res){

  
  const values = [
    req.body.name,
    req.body.teamID,
    req.body.leagueID,
    req.body.captainID,
  ];
  console.log(values[3])
  var hj = false;
  let q = `INSERT INTO teams (name, teamID, leagueID, captainSID)
  values ("${values[0]}", ${values[1]}, ${values[2]}, ${values[3]})`;

  db.query(q, (err, data) => {
    if(err){
      console.log(err)
      hj = true;
    }
  })
  if(hj){
    return null;
  }

  q = `UPDATE leagues set numTeams=numTeams+1 where leagueID=${values[2]}`
  db.query(q, (err, data) => {
  })
  const PlayerIDCalc = parseInt(`${values[3]/6}${values[2]/6}`)
  //divides both values by 6, regardless they would be the same, and be unique
  console.log(PlayerIDCalc)
// insert into players what am i doin bruh
  q = `INSERT INTO players (playerID, teamID, studentID) values (${PlayerIDCalc},${values[1]},${values[3]})`
  db.query(q, (err, data) => {
      if (err) return res.send(err);
    })
}

export function studentJoinTeam(req,res){
    const values = [
        req.body.studentID,
        req.body.teamID,
    ]
    let leagueID = null;
    let q = `SELECT teams.leagueID from teams LEFT JOIN leagues on (teams.leagueID = leagues.leagueID) where teamID=${values[1]};`;
    db.query(q, (err,data) => {
        if(!err)
            leagueID = res.json(data)[0].leagueID;
    })
    // check if max or nah
    q = `SELECT numPlayers from teams LEFT JOIN leagues ON teams.leagueID = leagues.leagueID where teams.numPlayers>=leagues.maxPlayers where teams.teamID = ${values[1]};`
    db.query(q, (err,data)=>{
        console.log("max players reached for this team")
        return null;
    })

    console.log(leagueID)
    const PlayerIDCalc = parseInt(`${values[0]}${leagueID}`)
    //meh
    q = `UPDATE teams set numPlayers = numPlayers + 1 where teamID=${values[1]}`
    db.query(q, (err, data) => {
        if(data==[]){
            return null;
        }
      })

    q = `INSERT INTO players (studentID, teamID, playerID) values (${values[0]},${values[1]},${PlayerIDCalc})`
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
      })
}


export function studentLeaveTeam(req,res){
    
    const values = [
        req.body.studentID,
        req.body.teamID,
    ]
    let leagueID = null;
    let q = `SELECT teams.leagueID from teams LEFT JOIN leagues on (teams.leagueID = leagues.leagueID) where teamID=${values[1]};`;
    db.query(q, (err,data) => {
        if(!err)
            leagueID = res.json(data)[0].leagueID;
    })

   
    console.log(leagueID)
    const PlayerIDCalc = parseInt(`${values[0]/6}${leagueID/6}`)
    //meh
    q = `UPDATE teams set numPlayers = numPlayers - 1 where teamID=${values[1]}`
    db.query(q, (err, data) => {
        if(data==[]){
            return null;
        }
      })

    q = `DELETE FROM players where playerID=${PlayerIDCalc}`
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
      })
}

