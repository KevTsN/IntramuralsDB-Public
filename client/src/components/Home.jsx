import { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faVolleyball, faBasketball, faFutbol, faPersonRunning,
    faCircleChevronDown, faCircleChevronUp
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom"
import { useStudentStore } from "../Stores"
import {PropTypes} from 'prop-types'


class Team {
    constructor(name, sport, numPlayers,level,gender, wins, losses) {
      this.name = name;
      this.sport = sport;
      this.numPlayers=numPlayers;
      this.level=level;
      this.gender=gender;
      this.wins = wins;
      this.losses=losses;
    }
  }
export function Home(){

    const [confirmChanges, setConfirmChanges] = useState(false)
    const teams=useStudentStore((state)=>state.teams)
    const updateTeams = useStudentStore((state) => state.updateTeams)

    const sid =useStudentStore((state)=>state.studentID)


    const navigate = useNavigate()
    function onLogOut() {
        navigate('/logout')
      }
    const [newTeamID, setNewTeamID] = useState("")
    const [teamIdError, setTeamIdError] = useState("")

    const [joinShow, setJoinShow] = useState(false)
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
        setJoinAttempt(false);}
        return()=>{
            effectRan.current = true;
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

                <div className="join-team-cont">
                    <div id="join-top">
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
            <button>Leave Team</button>
        </div>
    )
}

TeamTableEntry.propTypes = {
    teamObj:PropTypes.object
}
