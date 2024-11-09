import { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faVolleyball, faBasketball, faFutbol, faPersonRunning,
    faCircleChevronDown, faCircleChevronUp
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom"
import { useStudentStore, useCurrLeagueStore } from "../Stores"
import {PropTypes} from 'prop-types'
import { useShallow } from 'zustand/react/shallow'


export function Home(){

    const [confirmChanges, setConfirmChanges] = useState(false)
    const teams=useStudentStore((state)=>state.teams)
    const updateTeams = useStudentStore((state) => state.updateTeams)
    const leagues=useStudentStore((state)=>state.leagues)
    const updateLeagues = useStudentStore((state) => state.updateLeagues)

    const sid =useStudentStore((state)=>state.studentID)


    const navigate = useNavigate()
    function onLogOut() {
        navigate('/logout')
      }
    const [newTeamID, setNewTeamID] = useState("")
    const [teamIdError, setTeamIdError] = useState("")

    const [joinShow, setJoinShow] = useState(false)
    const [leagueShow, setLeagueShow] = useState(false)
    //keep as string for sql query

    const [numTeams,setNumTeams] = useState(teams.length); //for rerendering i suppose

    const fullName = localStorage.getItem("fullName")
    const [joinAttempt, setJoinAttempt] = useState(false)
    //effect ran!!!

    const effectRan = useRef(false)

    function onJoinClick(){
        if('' === newTeamID){
            setTeamIdError("Please enter a valid team ID.");
            return;
        }
        setJoinAttempt(true)     
    }
    useEffect(()=>{
    
        if(!effectRan.current){
            const fetchTeams = async() => {
                {
                    const url = `http://localhost:8800/teams/student/${sid}`
                    const result = await fetch(url);
                    result.json().then(json => {
                        updateTeams(json)
                    })
                }
            }
            fetchTeams();
            const fetchLeagues = async() => {
                {
                    const url = `http://localhost:8800/leagues/student/${sid}`
                    //change to student league query
                    const result = await fetch(url);
                    result.json().then(json => {
                        updateLeagues(json)
                    })
                }
            }
            fetchLeagues();



        if(joinAttempt){
            const fetchTeam = async() => {
                {
                    const url = `http://localhost:8800/teams/${newTeamID}`
                    const result = await fetch(url);
                    result.json().then(json => {
                        let jason = json[0]
                        if(jason){
                            const joinTeam = async() => {
                                const myHeaders = new Headers();
                                myHeaders.append("Content-Type", "application/json");
    
                                const response = await fetch("http://localhost:8800/players", {
                                method: "POST",
                                // 
                                body: JSON.stringify({ 
                                    studentID: sid,
                                    teamID: newTeamID,
                                }),

                                headers: myHeaders,
                                 });
                            } 
                            joinTeam();
                            setTeamIdError("Joining new team.")
                            navigate()
                        }
                        else{
                            setTeamIdError('No team exists with this ID.')
                        }
                    })
                }
                fetchTeam();
            }
        }
        setJoinAttempt(false);
        return()=>{
            effectRan.current = true;
        }
    
    }
        
    }, [joinAttempt])


    return(
        <div className="content" style={{alignItems: "center", width: "90%"}}>
            <div id="home">
                <h1>Carleton University Intramurals</h1>
                <h2>Home</h2>
                <div className="user-cont">
                    <h5>User: {fullName} </h5>
                    <a className="fake-ref" href="">
                    <button className="logout-button" onClick={onLogOut}> Log Out </button>
                </a>
                </div>
                
                <TeamTable teams={teams}></TeamTable>

                <div className="home-sub-cont">
                    <div id="home-sub-top">
                        <label> <h3> Join new team 
                        {joinShow && <FontAwesomeIcon id="toggle-join" icon={faCircleChevronUp} onClick={()=>{setJoinShow(!joinShow)}} />}
                        {!joinShow && <FontAwesomeIcon id="toggle-join" icon={faCircleChevronDown} onClick={()=>{setJoinShow(!joinShow)}} />}
                            </h3> 
                        </label>
                        
                    </div>

                    {joinShow &&
                    <> 
                    <div id="new-team-input" className = "input-container">
                            <input
                            value={newTeamID}
                            placeholder="Enter team ID"
                            onChange={(ev) => setNewTeamID(ev.target.value)}
                            className="input-box"
                            />
                        </div>
                    <label> {teamIdError} </label>
                    <button id="join-button" onClick={onJoinClick}>Join Team</button>
                    {/* onclick for join team */}

                </>
                }
                </div>


                <div className="home-sub-cont">
                    <div id="home-sub-top">
                        <label> <h3> View Leagues 
                        {leagueShow && <FontAwesomeIcon id="toggle-join" icon={faCircleChevronUp} onClick={()=>{setLeagueShow(!leagueShow)}} />}
                        {!leagueShow && <FontAwesomeIcon id="toggle-join" icon={faCircleChevronDown} onClick={()=>{setLeagueShow(!leagueShow)}} />}
                            </h3> 
                        </label>
                        
                    </div>

                    {leagueShow &&
                    <LeagueTable leagues={leagues}></LeagueTable>
                }
                </div>


            </div>

        </div>
    )

}



const TeamTable = ({teams}) =>{
    const indices = [...Array(teams.length).keys()]
    return(
        <div className="t-table-full">

            <h2 style={{textAlign: "left", marginBottom: "10px", width: "100%"}}> Manage Teams </h2>
            <div className="team-table">
                {indices.map((e) => {
                        return <TeamTableEntry key={e} teamObj={teams.at(e)}></TeamTableEntry>
                    })}
            </div>

        </div>
    )
}

TeamTable.propTypes = {
    teams: PropTypes.array
}

const TeamTableEntry = ({teamObj}) => {
    const name=teamObj.name;
    const sport = teamObj.sport;
    const wins = teamObj.wins;
    const losses=teamObj.losses;
    const gender = teamObj.genders;
    const level = teamObj.skillLevel;

    const sid =useStudentStore((state)=>state.studentID)


    let sportIcon = null;
    switch(sport){
        case "Soccer":
            sportIcon = <FontAwesomeIcon icon={faFutbol}> </FontAwesomeIcon>
            break;
        case "Basketball":
            sportIcon = <FontAwesomeIcon icon={faBasketball}></FontAwesomeIcon>
            break;
        case "Volleyball":
            sportIcon = <FontAwesomeIcon icon={faVolleyball}></FontAwesomeIcon>
            break;
        default:
            sportIcon = <FontAwesomeIcon icon={faPersonRunning} />;
            break;
        }

    return(
        <div className="team-entry">
            <div className="team-info">
                <h3 className="team-name"> {sportIcon} {name}  </h3>
                <h5>Record: {wins} W {losses} L </h5>
                <p className="team-league-info"> {gender} {sport}, Level {level}</p>
            </div>
            {sid!=teamObj.captainID && <button>Leave Team</button>}
            {sid==teamObj.captainID && <button>Edit Team</button>}
        </div>
    )
}

TeamTableEntry.propTypes = {
    teamObj:PropTypes.object
}

const LeagueTable = ({leagues}) => {
    const indices = [...Array(leagues.length).keys()]
    return(

            <div className="team-table">
                {indices.map((e) => {
                        return <LeagueTableEntry key={e} leagueObj={leagues.at(e)}></LeagueTableEntry>
                    })}
            </div>

    )
}

LeagueTable.propTypes = {
    leagues: PropTypes.array
}

const LeagueTableEntry = ({leagueObj}) => {
    const sport = leagueObj.sport;
    const numTeams = leagueObj.numTeams;
    const maxTeams = leagueObj.maxTeams;
    const maxPlayers = leagueObj.maxPlayers;
    const gender = leagueObj.genders;
    const level = leagueObj.skillLevel;

    const updateID = useCurrLeagueStore(useShallow((state) => state.updateID));
    const updateNumTeams = useCurrLeagueStore(useShallow((state) => state.updateNumTeams));
    const updateMaxTeams = useCurrLeagueStore(useShallow((state) => state.updateMaxTeams));
    const updateSport = useCurrLeagueStore(useShallow((state) => state.updateSport));
    const updateMaxPlayers = useCurrLeagueStore(useShallow((state) => state.updateMaxPlayers));
    const updateGenders = useCurrLeagueStore(useShallow((state) => state.updateGenders));
    const updateLevel = useCurrLeagueStore(useShallow((state) => state.updateLevel));



    const navigate = useNavigate()


    let sportIcon = null;
    switch(sport){
        case "Soccer":
            sportIcon = <FontAwesomeIcon icon={faFutbol}> </FontAwesomeIcon>
            break;
        case "Basketball":
            sportIcon = <FontAwesomeIcon icon={faBasketball}></FontAwesomeIcon>
            break;
        case "Volleyball":
            sportIcon = <FontAwesomeIcon icon={faVolleyball}></FontAwesomeIcon>
            break;
        default:
            sportIcon = <FontAwesomeIcon icon={faPersonRunning} />;
            break;
        }

    function handleClick(){
        updateID(leagueObj.leagueID);
        updateLevel(level)
        updateGenders(gender)
        updateSport(sport)
        updateMaxPlayers(maxPlayers)
        updateNumTeams(numTeams)
        updateMaxTeams(maxTeams)
        navigate('/createteam')
    }
    return(
        <div className="team-entry">
            <div className="team-info">
                <h3 className="team-name"> {sportIcon} {gender} {sport} </h3>
                <h5>Level {level} </h5>
                <p className="team-league-info">Max players: {maxPlayers}, {numTeams}/{maxTeams} teams</p>
            </div>
            <button onClick={handleClick}>Create Team</button>
        </div>
    )
    
}

LeagueTableEntry.propTypes = {
    leagueObj: PropTypes.object
}