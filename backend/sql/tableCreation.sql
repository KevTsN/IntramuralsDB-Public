create table students (studentID int, password varchar(15), gender varchar(8), firstName varchar(15), lastName varchar(15), primary key (studentID));
create table leagues (leagueID int, maxPlayers int, genders varchar(8), maxTeams int, sport varchar(12), numTeams int default 0, skillLevel int, primary key (leagueID));
create table teams (teamID int, name varchar(30), leagueID int, numPlayers int default 1, wins int default 0, losses int default 0, captainSID int, primary key (teamID), foreign key (leagueID) references leagues(leagueID));
create table players (teamID int, studentID int, leagueID int, primary key (studentID, leagueID), foreign key (studentID) references students(studentID), foreign key (teamID) references teams(teamID), foreign key (leagueID) references leagues(leagueID));
create table join_requests (studentID int, teamID int, requestTime timestamp default current_timestamp, primary key (studentID, teamID), foreign key (studentID) references students(studentID), foreign key (teamID) references teams(teamID));
create table games (homeID int, awayID int, location varchar(20) default 'Norm Fenn Gymnasium' , leagueID int, gameTime timestamp default current_timestamp, primary key(homeID, awayID, gameTime), 
foreign key(homeID) references teams(teamID), foreign key (awayID) references teams(teamID), foreign key (leagueID) references leagues(leagueID));
