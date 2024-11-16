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
    const studentID = req.params.id;
    const q = " SELECT * FROM students WHERE studentID = ? ";
  
    db.query(q, [studentID], (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    })
}

export function teamByID(req, res) {
    const teamID = req.params.id;
    const q = " SELECT teams.*, leagues.genders, leagues.maxPlayers from teams join leagues ON (teams.leagueID = leagues.leagueID) WHERE teamID = ? ";
  
    db.query(q, [teamID], (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    })
}

export function teamsByLeague(req, res) {
  const leagueID = req.params.id;
  const q = " SELECT * from teams WHERE leagueID = ? ";

  db.query(q, [leagueID], (err, data) => {
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

export async function createTeam(req,res){

  
  const values = [
    req.body.name,
    req.body.teamID,
    req.body.leagueID,
    req.body.captainID,
  ];

  
  let q = `INSERT INTO teams (teamID, leagueID, captainSID)
  values ( ${values[1]}, ${values[2]}, ${values[3]})`;
  db.query(q, (err, data) => {
    if(err){
      console.log(err)
      return res.send(err);
    }
  })

  if(await checkLeagueForName(values[1], values[0]) == true){
    console.log("wuh-woh")
    q = `delete from teams where teamID=${values[1]}`;
    db.query(q,(err,data)=>{})
    return res.send("There is already a team with this name.");
  }

  q=`update teams set name="${values[0]}" where teamID=${values[1]}`;

  db.query(q, (err, data) => {
    if(err){
      console.log(err)
      return res.send(err);
    }
  })

  q = `UPDATE leagues set numTeams=numTeams+1 where leagueID=${values[2]}`
  db.query(q, (err, data) => {
    if(err)
      console.log(err)
  })
  let PlayerIDCalc = parseInt(`${values[3]}${values[2]}`)
  PlayerIDCalc = Math.floor(PlayerIDCalc%1000000000);
  q = `INSERT INTO players (playerID, teamID, studentID) values (${PlayerIDCalc},${values[1]},${values[3]})`
  db.query(q, (err, data) => {
      if (err) {
        console.log(err)
        return res.send(err);
      }
      return res.json(data);
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
  let q = `SELECT numPlayers from teams where teamID=${teamID} and numPlayers < 2`;
  const [rows,fields]=await db.promise().query(q);

  // if(rows.affectedRows < 1)
  //   return false;
  console.log(rows);
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
  //console.log(`league: ${leagueGenders}, student: ${studentGender}`)
  let returnVal = true;
  switch(leagueGenders){
      case "Male":
        return (studentGender == "M");
        
      case "Female":
        return (studentGender == "F");
  }
  return true;
}

async function canJoin(teamID, studentID){
  if(await isTeamFull(teamID) == true){
    console.log("MAX AMOUNT OF PLAYERS REACHED IN THIS TEAM")
    return false;
  }
  if(await allowedGender(teamID, studentID) == false){
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
    
    console.log("HE HIT MY CAR ON THE HIGHWAY AND HE TRYNA LEAVE")
    //will team be empty
    let q = `SELECT teams.leagueID from teams LEFT JOIN leagues on (teams.leagueID = leagues.leagueID) where teamID=${values[1]}`;
    let leagueID = await getLeagueId(q);
    console.log("League is " + leagueID)

    if(await willTeamEmpty(values[1]) == true){
      console.log(`The team with ID ${values[1]} will be deleted because there are no more players left.`)

      q = `delete from teams where teamID=${values[1]}`;
      db.query(q,(err,data)=>{
        if (err) return res.send(err);
      })
      q = `update leagues set numTeams=numTeams -1 where leagueID=${leagueID}`;
      db.query(q,(err,data)=>{
        if (err) return res.send(err);
      })

      q = `delete from players where teamID=${values[1]}`
      db.query(q, (err,data)=>{        
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
}

export async function checkLeagueForName(teamID, name){
  let q = `select leagueID from teams where teamID=${teamID}`
  let [rows,fields] = await db.promise().query(q);
  let leagueId = rows.pop()['leagueID']
  q = `select * from teams where leagueID=${leagueId} and name="${name}"`
  let [crows,seals] = await db.promise().query(q);

  //returns if there is an existing row
  return (crows.pop() !== undefined)

}



export async function updateTeam(req,res){
  const bodyObj = {
    teamID: req.body.teamID,
    captainID: req.body.captainID,
    newName: req.body.name,
  }
  if(await checkLeagueForName(bodyObj["teamID"], bodyObj["newName"]) == true){
    return false;
  }


  
  console.log(bodyObj)
  let q = `UPDATE teams set name = "${bodyObj['newName']}" where teamID = ${bodyObj['teamID']}`
  db.query(q, (err,data) =>{
    if(err) return res.send(err);
  })

  q = `UPDATE teams set captainSID = ${bodyObj['captainID']} where teamID=${bodyObj['teamID']}`
  db.query(q, (err,data) =>{
    if(err) return res.send(err);
  })
  
}

