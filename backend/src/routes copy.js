//import mysql from "mysql2"
import dotenv from 'dotenv';
dotenv.config();
import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./sql/database.db');

export function leagues(req, res) {
    const q = "SELECT * FROM leagues";
    db.all(q, (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else {
        res.send(rows);
      }
    });
  }

  export function players(req,res){
    const q = "SELECT * FROM players";
    db.all(q, (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else {
        res.send(rows);
      }
    });
  }
  
  export function teams(req,res){
    const q = "SELECT * FROM teams";
    db.all(q, (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else {
        res.send(rows);
      }
    });
  }

  export function students(req,res){
    const q = "SELECT * FROM students";
    db.all(q, (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else {
        res.send(rows);
      }
    });
  }

  export function playerByID (req, res) {

    //const playerID = req.params.id;
    const q = " SELECT * FROM players " // used to be WHERE playerID = ? ";
  
    db.all(q, (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else {
        res.send(rows);
      }
    });
  }

 export function studentByID(req, res) {
    const studentID = req.params.id;
    const q = `SELECT * FROM students WHERE studentID = ${studentID} `;
  
    db.all(q, (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else {
        res.send(rows);
      }
    });
}

export function teamByID(req, res) {
    const teamID = req.params.id;
    const q = ` SELECT teams.*, leagues.genders, leagues.maxPlayers from teams join leagues ON (teams.leagueID = leagues.leagueID) WHERE teamID = ${teamID} `;
  
    db.all(q, (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else {
        res.send(rows);
      }
    });
}

export function teamsByLeague(req, res) {
  const leagueID = req.params.id;
  const q = ` SELECT teams.*, leagues.genders, leagues.sport from teams left join leagues ON (teams.leagueID = leagues.leagueID) WHERE teams.leagueID = ${leagueID} `;

  db.all(q, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.send(rows);
    }
  });
}

  export function studentTeams(req, res) {
    const studentID = req.params.id;
    /*example from Anom on 
    https://stackoverflow.com/questions/13131496/how-to-do-join-on-multiple-criteria-returning-all-combinations-of-both-criteria
    */

    const q = `SELECT one.*, three.sport, three.skillLevel, three.genders FROM teams AS one INNER JOIN players AS two ON (one.teamID = two.teamID AND two.studentID = ${studentID}) LEFT JOIN leagues AS three ON (one.leagueID = three.leagueID)`;
  
    db.all(q, (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else {
        res.send(rows);
      }
    });
}

export function availableLeagues(req,res){
  const studentID = req.params.id;
  // const q = `SELECT DISTINCT leagues.* from players INNER JOIN teams ON (players.teamID = teams.teamID and players.studentID = ${studentID}) RIGHT JOIN leagues ON (leagues.leagueID = teams.leagueID) where studentID IS NULL and leagues.numTeams<leagues.maxTeams`
  const q = `select * from leagues`;
  db.all(q, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.send(rows);
    }
  });
}

export function studentsInTeam(req,res){
  const teamID = req.params.id;
  const q =  `SELECT players.*, students.firstName, students.lastName, teams.captainSID, students.gender from players INNER JOIN teams ON (players.teamID = teams.teamID and players.studentID != teams.captainSID) LEFT JOIN students ON (players.studentID = students.studentID) where players.teamID=${teamID};`;
  db.all(q, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.send(rows);
    }
  });
}

export function checkLogin(req,res){

    const id = req.params.id
    const pw = req.params.password;

    const q = `SELECT studentID, firstName, lastName, gender from students where (studentID = ${id} AND password like '${pw}')`
    //collate and convert work 
    db.all(q, (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else {
        res.send(rows);
      }
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
  
    db.exec(q, function(err){ 
      if(err) return res.send(err);
      res.sendStatus(200);
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
  db.exec(q, function(err){ if(err) 
    { 
      return res.send(err);}
  })
  
  if(await checkLeagueForName(values[1], values[0]) == true){
    q = `delete from teams where teamID=${values[1]}`;
    db.exec(q, function(err){ if(err) return res.send(err);})
      return res.status(400).send({
        message: 'A team already exists with this name.'
     });
  }

  q=`update teams set name="${values[0]}" where teamID=${values[1]}`;

  db.exec(q, function(err){ if(err) return res.send(err);})

  q = `UPDATE leagues set numTeams=numTeams+1 where leagueID=${values[2]}`
  db.exec(q, function(err){ if(err) return res.send(err);})

  q = `INSERT INTO players (leagueID, teamID, studentID) values (${values[2]},${values[1]},${values[3]})`
  db.exec(q, function(err){ 
    if(err) return res.send(err);
    res.sendStatus(200);
  })
}

async function getLeagueId(teamID){
  let q = `SELECT teams.leagueID from teams LEFT JOIN leagues on (teams.leagueID = leagues.leagueID) where teamID=${teamID}`;

  return new Promise((resolve,reject)=>{
    db.get(q, (err,row)=>{
      if(err) reject(err);
        resolve(row.leagueID)
    })
  })
}


async function isTeamFull(teamID){
  //use a specific query ofc
  let q = `SELECT numPlayers from teams LEFT JOIN leagues ON teams.leagueID = leagues.leagueID where teams.numPlayers>=leagues.maxPlayers and teams.teamID = ${teamID};`
  return new Promise((resolve,reject)=>{
    db.get(q, (err,row)=>{
      if(err) reject(err);
        resolve(row !== undefined)
    })
  })
  
}

//functions i need to update for sqlite
async function willTeamEmpty(teamID){
  let q = `SELECT numPlayers from teams where (teamID=${teamID} and numPlayers < 2)`;

    return new Promise((resolve, reject) => {
      db.all(q,(err, rows) => {
          if (err) reject(err);
          resolve(rows.length > 0);
      });
  });
}


async function allowedGender(teamID, studentID){
  let q = `SELECT leagues.genders, teams.teamID from leagues LEFT JOIN teams on (leagues.leagueID = teams.leagueID) where teams.teamID = ${teamID}`

  return new Promise((resolve, reject) => {
    db.get(q,(err, row) => {
        if (err) reject(err);
        let leagueGenders = row['genders']
        //leagueGenders now
        q = `SELECT gender from students where studentID = ${studentID}`
        db.get(q,(err, row) => {
          if (err) reject(err);
          studentGender = row['gender'];
          switch(leagueGenders){
            case "Male":
              resolve(studentGender == "M");
              break;
            case "Female":
              resolve(studentGender == "F")
              break;
          }
      });
    });
});
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

//

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

    let leagueID = await getLeagueId(values[1])

    // let PlayerIDCalc = parseInt(`${values[0]}${leagueID}`)
    // PlayerIDCalc = Math.floor(PlayerIDCalc%1000000000);
    //honestly i just did this bc my original thought was a humongous int lol
    //kinda low chance that it still finds a dupe number lol
    
    q = `UPDATE teams set numPlayers = numPlayers + 1 where teamID=${values[1]}`
    db.exec(q, function(err){ if(err) return res.send(err);})

    q = `INSERT INTO players (studentID, teamID, leagueID) values (${values[0]},${values[1]},${leagueID})`
    db.exec(q, function(err){ 
      if(err) return res.send(err);
      res.sendStatus(200);
    })
    return true;
}


export async function studentLeaveTeam(req,res){
    
    const values = [
        req.body.studentID,
        req.body.teamID,
    ]
    
    //will team be empty
    let q = ''
    let leagueID = await getLeagueId(values[1]);

    if(await willTeamEmpty(values[1]) == true){
      console.log(`The team with ID ${values[1]} will be deleted because there are no more players left.`)

      q = `delete from teams where teamID=${values[1]}`;
      db.exec(q, function(err){ if(err) return res.send(err);})

      q = `update leagues set numTeams=numTeams -1 where leagueID=${leagueID}`;
      db.exec(q, function(err){ if(err) return res.send(err);})

      q = `delete from players where (teamID=${values[1]} and studentID =${values[0]}`
      db.exec(q, function(err){ if(err) return res.send(err);})
    }


    q = `UPDATE teams set numPlayers = numPlayers - 1 where teamID=${values[1]}`
    db.exec(q, function(err){ if(err) return res.send(err);})

    q = `DELETE FROM players where (studentID = ${values[0]} and teamID=${values[1]})`
    db.exec(q, function(err){ 
      if(err) return res.send(err);
      res.sendStatus(200);
    })
}

export async function checkLeagueForName(teamID, name){
  
  let q = `select leagueID from teams where teamID=${teamID}`
  return new Promise((resolve, reject) => {
    db.get(q, (err,row)=>{
      if(err) reject (err)
      if(row === undefined)
        { return resolve(false)}

      
      if(row['leagueID'] === undefined){
        return resolve(false)
        //lowe it bro
      }
      let leagueID = row['leagueID']
      q = `select * from teams where leagueID=${leagueID} and name="${name}"`
      db.get(q, (err,row)=>{
        if(err) reject (err)
        resolve(row !== undefined)
      })
    })
  })
}



export async function updateTeam(req,res){
  const bodyObj = {
    teamID: req.body.teamID,
    captainID: req.body.captainID,
    newName: req.body.newName,
  }
  //console.log(bodyObj)
  let q = ""  
  if(typeof(bodyObj.newName) == "string"){
    if(await checkLeagueForName(bodyObj["teamID"], bodyObj["newName"]) == true){
      return false;
    }
    q = `UPDATE teams set name = "${bodyObj['newName']}" where teamID = ${bodyObj['teamID']}`
    db.exec(q, function(err){ if(err) return res.send(err);})

  }
  q = `UPDATE teams set captainSID = ${bodyObj['captainID']} where teamID=${bodyObj['teamID']}`
  db.exec(q, function(err){ 
    if(err) return res.send(err);
    res.sendStatus(200);
  })
  
}

export async function deleteTeam(req, res){
  const teamID = req.body.teamID;

  let q = `SELECT teams.leagueID from teams LEFT JOIN leagues on (teams.leagueID = leagues.leagueID) where teamID=${teamID}`;
  //lame lol

  let leagueID = await getLeagueId(teamID);

  console.log(`The team with ID ${teamID} is being deleted.`)

  q = `delete from teams where teamID=${teamID}`;
  db.exec(q, function(err){ if(err) return res.send(err);})

  q = `delete from join_requests where teamID=${teamID}`;
  db.exec(q, function(err){ if(err) return res.send(err);})

  q = `update leagues set numTeams=numTeams -1 where leagueID=${leagueID}`;
  db.exec(q, function(err){ if(err) return res.send(err);})

  q= `delete from games where (awayID = ${teamID} or homeID=${teamID})`
  db.exec(q, function(err){ if(err) return res.send(err);})


  q = `delete from players where teamID=${teamID}`
  db.exec(q, function(err){ 
    if(err) return res.send(err);
    res.sendStatus(200);
  })
}

export function addJoinRequest(req,res){
  const studentID = req.body.studentID;
  const teamID = req.body.teamID;
  let q = `insert into join_requests (studentID, teamID) values (${studentID}, ${teamID})`
  db.exec(q, function(err){ 
    if(err) return res.send(err)
    res.sendStatus(200);
    ;})
}

export function getJoinRequestsByTeam(req,res){
  const teamID = req.params.id;
  let q = `select join_requests.*, students.firstName, students.lastName, students.gender from join_requests left join students on (join_requests.studentID = students.studentID) where join_requests.teamID = ${teamID};`
  db.all(q, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.send(rows);
    }
  });
}

export function getJoinRequestsByStudent(req,res){
  const studentID = req.params.id;
  let q = `select join_requests.*, teams.name, leagues.sport, leagues.genders from join_requests inner join teams on 
  (teams.teamID = join_requests.teamID) left join leagues on (leagues.leagueID=teams.teamID) 
  where join_requests.studentID=${studentID}`;

  //im just imagining with this one ngl
  db.all(q, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.send(rows);
    }
  });
}

export function deleteJoinRequest(req,res){
  const studentID = req.body.studentID;
  const teamID = req.body.teamID;

  let q = `delete from join_requests where (teamID=${teamID} and studentID=${studentID})`;
  db.exec(q, function(err){ if(err) return res.send(err)
    // res.sendStatus(200);
    })
}

export async function addPlayerByReq(req,res){
  const studentID = req.body.studentID;
  const teamID = req.body.teamID;

  let q = `SELECT teams.leagueID from teams LEFT JOIN leagues on (teams.leagueID = leagues.leagueID) where teamID=${teamID};`;

  // if(await canJoin(teamID, studentID) === false){
  //   return false;
  // }

  let leagueID = await getLeagueId(teamID)

  //delete where this player already in league

  q = `select * from players where (leagueID=${leagueID} and studentID=${studentID})`
  db.get(q, (err,row)=>{
    if(err) return res.send(err);
    if(row){
      const dupeTeamID = row.teamID;
      let query = `update teams set numPlayers = numPlayers - 1 where teamID = ${dupeTeamID}`
      db.exec(query, function(err){ if(err) return res.send(err);})
    }
  })

  q = `UPDATE teams set numPlayers = numPlayers + 1 where teamID=${teamID}`
  db.exec(q, function(err){ if(err) return res.send(err);})

  q = `delete from players where (leagueID=${leagueID} and studentID=${studentID})`
  db.exec(q, function(err){
    if(err) return res.send(err);
    })
    
  q = `INSERT INTO players (studentID, teamID, leagueID) values (${studentID},${teamID},${leagueID})`
  db.exec(q, function(err){
    if(err) return res.send(err);
    })

     
  
  q = `select * from teams where captainSID = ${studentID} and leagueID = ${leagueID}`
  db.get(q, async (err, row) =>{
    if(err) return res.send(err)
    if(row !== undefined){
      const nextStudentID = await findNextPlayerID(row.teamID)
      if(nextStudentID != studentID){
        q = `update teams set captainSID = ${nextStudentID} where teamID=${row.teamID}`
        db.exec(q, function(err){ if(err) return res.send(err);})
      }
      else {
        q = `delete from teams where teamID=${row.teamID}`;
        db.exec(q, function(err){ if(err) return res.send(err);})
    
        q = `delete from join_requests where teamID=${row.teamID}`;
        db.exec(q, function(err){ if(err) return res.send(err);})
    
        q = `update leagues set numTeams=numTeams -1 where leagueID=${leagueID}`;
        db.exec(q, function(err){ if(err) return res.send(err);})
    
        q= `delete from games where (awayID = ${row.teamID} or homeID=${row.teamID})`
        db.exec(q, function(err){ if(err) return res.send(err);})
      }
    }
  })

  deleteJoinRequest(req,res);

}

async function findNextPlayerID(teamID){
  let q = `select studentID from players where teamID=${teamID}`
  return new Promise((resolve,reject)=>{
    db.get(q, (err,row)=>{
      if(err) reject(err);
      resolve(row.studentID)
    })
  })
}

export async function getGames(req,res){
  let q = `select * from games`;
  db.all(q, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.send(rows);
    }
  });
}

export async function gamesForTeam(req,res){
  const teamID = req.params.id;
  let q = `select games.gameTime, games.location, leagues.sport, leagues.genders, hm.name as homeName, aw.name as awayName from games left join teams as aw on (aw.teamID = games.awayID) left join teams as hm on (hm.teamID=games.homeID)
   inner join leagues on (leagues.leagueID = games.leagueID) where (games.awayID=${teamID} or games.homeID=${teamID});`  
  db.all(q, (err,rows) => {
    if(err){
      console.error(err.message);
      res.status(500).send("Internal server error.");}
      else{
        res.send(rows);
      }
    })
}

export async function gamesForStudent(req,res){
  const studentID = req.params.id;
  let q = `select games.gameTime, games.location, leagues.sport, leagues.genders, hm.name as homeName, aw.name as awayName from games left join players on (games.homeID = players.teamID or games.awayID = players.teamID) inner join leagues on (players.leagueID = leagues.leagueID) inner join teams as hm on (hm.teamID = games.homeID) inner join teams as aw on (aw.teamID = games.awayID) where players.studentID = ${studentID}`  
  db.all(q, (err,rows) => {
    if(err){
      console.error(err.message);
      res.status(500).send("Internal server error.");}
      else{
        res.send(rows);
      }
    })
}