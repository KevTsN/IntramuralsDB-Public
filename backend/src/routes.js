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
    const q = " SELECT * FROM teams WHERE teamID = ? ";
  
    db.query(q, [playerID], (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    })
}

  export function studentTeams(req, res) {
    const studentID = req.params.id;
    /*example from Anom on 
    https://stackoverflow.com/questions/13131496/how-to-do-join-on-multiple-criteria-returning-all-combinations-of-both-criteria
    */

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

export function studentsInTeam(req,res){
  const teamID = req.params.id;
  const q =  `SELECT players.*, students.firstName, students.lastName, teams.captainSID, students.gender from players INNER JOIN teams ON (players.teamID = teams.teamID and players.studentID != teams.captainSID) LEFT JOIN students ON (players.studentID = students.studentID) where players.teamID=${teamID};`;
  db.query(q, (err,data) => {
    if(err) return res.send(err);

    return res.json(data);
  })
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
  let PlayerIDCalc = parseInt(`${values[0]}${leagueID}`)
  PlayerIDCalc = Math.floor(PlayerIDCalc%1000000000);
  q = `INSERT INTO players (playerID, teamID, studentID) values (${PlayerIDCalc},${values[1]},${values[3]})`
  db.query(q, (err, data) => {
      if (err) return res.send(err);
    })
}

async function getLeagueId(query){
  const [rows,fields] = await db.promise().query(query);
  return rows[0]['leagueID'];
}

async function isTeamFull(teamID){
  //use a specific query ofc
  let q = `SELECT numPlayers from teams LEFT JOIN leagues ON teams.leagueID = leagues.leagueID where teams.numPlayers>=leagues.maxPlayers and teams.teamID = ${teamID};`
  const [rows,fields]=await db.promise().query(q);

  if(rows.affectedRows < 1)
    return false;

  let mbappe = rows.pop();

  if(mbappe !== undefined)
    return true;
  return false;
}

async function willTeamEmpty(teamID){
  let q = `SELECT numPlayers from teams where teamID=${teamID} and numPlayers = 1`;
  const [rows,fields]=await db.promise().query(q);

  // if(rows.affectedRows < 1)
  //   return false;

  let mbappe = rows.pop();

    if(mbappe === undefined)
      return true;
    return false;
}


async function allowedGender(teamID, studentID){
  let q = `SELECT leagues.genders, teams.teamID from leagues LEFT JOIN teams on (leagues.leagueID = teams.leagueID) where teams.teamID = ${teamID}`
  const [rows,fields] = await db.promise().query(q);

  // if(rows.affectedRows < 1)
  //   return false;

  let leagueGenders = rows[0]['genders'];
  q = `SELECT gender from students where studentID = ${studentID}`
  const [crows,seals] = await db.promise().query(q);

  // if(crows.affectedRows < 1)
  //   return false;

  let studentGender = crows[0]['gender'];
console.log(`league: ${leagueGenders}, student: ${studentGender}`)
  let returnVal = true;
  switch(leagueGenders){
      case "Male":
        if(studentGender != "M"){
          console.log("H-H-HELL NAH")
          returnVal = false;
          break;
        }
      case "Female":
        if(studentGender != "F"){
          console.log("H-H-HELL NAH")
          returnVal = false;
          break;
        }
        //was this transphobic chat
        //please delete this comment, future me.
  }
  return returnVal;
}

async function canJoin(teamID, studentID){
  console.log(studentID)
  if(await isTeamFull(teamID) === true){
    console.log("MAX AMOUNT OF PLAYERS REACHED IN THIS TEAM")
    return false;
  }
  if(await allowedGender(teamID, studentID) === false){
    console.log("Sorry, this player is not eligible to join this team due to their gender.");
    return false;
  }
  return true;
}

export async function studentJoinTeam(req,res){
    const values = [
        req.body.studentID,
        req.body.teamID,
    ]
    let q = `SELECT teams.leagueID from teams LEFT JOIN leagues on (teams.leagueID = leagues.leagueID) where teamID=${values[1]};`;
    //dw, teamID is unique ;)

    // check if max, and if eligible gender
    if(await canJoin(values[1], values[0]) === false){
      return false;
    }

    let leagueID = await getLeagueId(q)

    let PlayerIDCalc = parseInt(`${values[0]}${leagueID}`)
    PlayerIDCalc = Math.floor(PlayerIDCalc%1000000000);
    //honestly i just did this bc my original thought was a humongous int lol
    //kinda low chance that it still finds a dupe number lol
    
    q = `UPDATE teams set numPlayers = numPlayers + 1 where teamID=${values[1]}`
    db.query(q, (err, data) => {})

    q = `INSERT INTO players (studentID, teamID, playerID) values (${values[0]},${values[1]},${PlayerIDCalc})`
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        
        return res.json(data);
      })
    return true;
}


export async function studentLeaveTeam(req,res){
    
    const values = [
        req.body.studentID,
        req.body.teamID,
    ]
    
    console.log(leagueID)
    //will team be empty
    let emp = willTeamEmpty(values[1]);

    let leagueID = await getLeagueId(q);

    if(emp){
      console.log(`The team with ID ${values[1]} will be deleted because there are no more players left.`)

      q = `delete from teams where teamID=${values[1]}`;
      db.query(q,(err,data)=>{
        if (err) return res.send(err);
      })
    }


    let PlayerIDCalc = parseInt(`${values[0]}${leagueID}`)
    PlayerIDCalc = Math.floor(PlayerIDCalc%1000000000);
    q = `UPDATE teams set numPlayers = numPlayers - 1 where teamID=${values[1]}`
    db.query(q, (err, data) => {
      if (err) return res.send(err);
        }
    )

    q = `DELETE FROM players where playerID=${PlayerIDCalc}`
    db.query(q, (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
      })

    if(mbappe){
      console.log("Team will be deleted because last member has lefted")
    }
}

