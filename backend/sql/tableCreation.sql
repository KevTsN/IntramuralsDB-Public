CREATE TABLE leagues (skillLevel int, numTeams int, sport varchar(12), maxTeams int, genders varchar(8), maxPlayers int, leagueID int, PRIMARY KEY (leagueID)); 
CREATE TABLE students (studentID int, password varchar(15), gender varchar(8), firstName varchar(15), lastName varchar (15), PRIMARY KEY (studentID));
CREATE TABLE players (playerID int, studentID int, teamID int, PRIMARY KEY (playerID), FOREIGN KEY (studentID) references students(studentID);
CREATE TABLE teams (name varchar(30), teamID int, leagueID int, numPlayers int, wins int, losses int, PRIMARY KEY (teamID), FOREIGN KEY (leagueID) references leagues(leagueID); 
