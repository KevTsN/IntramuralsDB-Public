import { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faVolleyball, faBasketball, faFutbol, faPersonRunning,
    faCircleChevronDown, faCircleChevronUp
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom"
import { useStudentStore, useCurrLeagueStore, useCurrTeamStore } from "../Stores"
import {PropTypes} from 'prop-types'
import { useShallow } from 'zustand/react/shallow'
import { canJoinGender } from "../ApiFunctions"
import { LeagueTeams } from "./LeagueTeams"


export function Home(){

    const navigate = useNavigate()
    

    const [confirmChanges, setConfirmChanges] = useState(false)
    const teams=useStudentStore((state)=>state.teams)
    const updateTeams = useStudentStore((state) => state.updateTeams)
    const leagues=useStudentStore((state)=>state.leagues)
    const updateLeagues = useStudentStore((state) => state.updateLeagues)
    const updateRequests =useStudentStore((state)=>state.updateRequests)

    const stuGen=useStudentStore((state)=>state.gender)

    const sid =useStudentStore((state)=>state.studentID)


   
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

    //console.log(teams)

    const effectRan = useRef(false)

    function onJoinClick(){
        if('' === newTeamID){
            setTeamIdError("Please enter a valid team ID.");
            return;
        }
        setJoinAttempt(true) 
        effectRan.current = false;    
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

            const fetchRequests = async() => {
                {
                    const url = `http://localhost:8800/student/requests/${sid}`
                    const result = await fetch(url);
                    result.json().then(json => {
                        updateRequests(json);
                    })
                }
            }
            fetchRequests();

        if(joinAttempt){
            setTeamIdError("")
            const fetchTeam = async() => {
                    const url = `http://localhost:8800/teams/${newTeamID}`
                    const result = await fetch(url);
                    result.json().then(json => {
                        let jason = json[0]
                        
                        if(jason){

                            if(jason['maxPlayers'] <= jason['numPlayers']){
                                setTeamIdError("This team has reached maximum capacity.")
                                return;
                            }
                            if(canJoinGender(jason['genders'], stuGen) == false){
                                setTeamIdError(`Gender restrictions prevent you from joining this team. The specified team gender is ${jason['genders'].toLowerCase()}.`)
                                return;
                            }

                            teams.forEach(team => {
                                if(team['teamID'] == newTeamID){
                                    setTeamIdError(`You've already joined the team \"${team['name']}\".`)
                                    return;
                                }
                            });


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
                                 setNumTeams(numTeams+1)
                            } 
                            joinTeam();
                            setTeamIdError("Joining team.")
                            setTimeout(()=>{
                                window.location.reload();
                            })
                            
                            
                        }
                        else{
                            setTeamIdError('No team exists with this ID.')
                        }
                    })
            }
            fetchTeam();
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
                
                <TeamTable teams={teams} view="Student" ></TeamTable>

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



const TeamTable = ({teams, view}) =>{
    const indices = [...Array(teams.length).keys()]
    return(
        <div className="t-table-full">

            {view == "Student" && <h2 style={{textAlign: "left", marginBottom: "10px", width: "100%"}}> Manage Teams </h2>}
            <div className="tl-table">
                {indices.map((e) => {
                        return <TeamTableEntry key={e} view={view} teamObj={teams.at(e)}></TeamTableEntry>
                    })}
            </div>

        </div>
    )
}

TeamTable.propTypes = {
    teams: PropTypes.array,
    view: PropTypes.string
}

export const TeamTableEntry = ({teamObj, view}) => {
    const navigate = useNavigate();
    const name=teamObj.name;
    const sport = teamObj.sport;
    const wins = teamObj.wins;
    const losses=teamObj.losses;
    const gender = teamObj.genders;
    const level = teamObj.skillLevel;

    const teamID=teamObj.teamID;
    const sid =useStudentStore((state)=>state.studentID)
    const reqs =useStudentStore((state)=>state.outRequests)
    const updateRequests =useStudentStore((state)=>state.updateRequests)


    const updateTeamRequests =useCurrTeamStore((state)=>state.updateRequests)
    const updateName = useCurrTeamStore(useShallow((state) => state.updateName));
    const updateTeamID = useCurrTeamStore(useShallow((state) => state.updateTeamID));
    const updateLeagueID = useCurrTeamStore(useShallow((state) => state.updateLeagueID));
    const updateNumPlayers = useCurrTeamStore(useShallow((state) => state.updateNumPlayers));
    const updateCaptainSID = useCurrTeamStore(useShallow((state) => state.updateCaptainSID));
    const updateGenders = useCurrLeagueStore(useShallow((state) => state.updateGenders));

    const updateSport = useCurrLeagueStore(useShallow((state) => state.updateSport));
    const updateLevel = useCurrLeagueStore(useShallow((state) => state.updateLevel));
    const updatePlayers = useCurrTeamStore(useShallow((state)=> state.updatePlayers));
    

    const [confirmShow, setConfirmShow] = useState(false)

    const [editClicked, setEditClicked] = useState(false)
    const [leaveConfirm, setLeaveConfirm] = useState(false)

    const[request, setRequest] = useState(false)
    const [canReq, setCanReq] = useState(true);
    const [deleteReq, setDelete] = useState(false)

    function handleEdit(){
        setEditClicked(false)
        updateName(teamObj.name);
        updateTeamID(teamObj.teamID)
        updateLeagueID(teamObj.leagueID)
        updateNumPlayers(teamObj.numPlayers)
        updateCaptainSID(teamObj.captainSID)
        updateGenders(teamObj.genders)
        updateSport(teamObj.sport)
        updateLevel(teamObj.skillLevel)
        setEditClicked(true);
        navigate('/teamedit');
    }

    function handleLeaveClick(){
        //save for later because i gotta do the whole confirm changes shit
        setConfirmShow(true);
        effectRan.current = false;

    }

    function handleConfirmLeave(){
        setLeaveConfirm(true);
        effectRan.current = false;

    }

    function handleJoinRequest(){
        setRequest(true);
        effectRan.current = false;
    }

    function handleDeleteRequest(){      
        setDelete(true); 
        effectRan.current = false;
    }

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

    const effectRan = useRef(false)
    useEffect(()=>{

        
        if(!effectRan.current){
            const fetchRequests = async() => {
                {
                    const url = `http://localhost:8800/student/requests/${sid}`
                    const result = await fetch(url);
                    result.json().then(json => {
                        updateRequests(json);
                    })
                }
            }
            fetchRequests();
            reqs.forEach(element => {
                if(element.teamID == teamID){
                    return setCanReq(false);
                }
            });
            //setRequest(true);
            //request btn doesnt render smooth

            if(editClicked){
                //console.log(teamID)
                const fetchPlayers = async() => {
                        const result = await fetch(`http://localhost:8800/players/team/${teamID}`, {
                            
                        })
                        result.json().then(json => {
                            //console.log(json)
                                updatePlayers(json);
                            })
                        }
                    fetchPlayers();

                    const fetchTeamRequests = async() => {
                        const result = await fetch(`http://localhost:8800/team/${teamID}/requests/`, {
                            
                        })
                        result.json().then(json => {
                            console.log(json)
                                updateTeamRequests(json);
                            })
                        }
                    fetchTeamRequests();

            navigate('/teamedit');
            }

            setEditClicked(false);

            if(leaveConfirm == true){
                const leaveTeam = async() => {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    const response = await fetch("http://localhost:8800/players", {
                    method: "DELETE",
                    // 
                    body: JSON.stringify({ 
                        studentID: sid,
                        teamID: teamID,
                    }),

                    headers: myHeaders,
                    });
                    console.log('yo')
                } 
                leaveTeam();
                setLeaveConfirm(false);
                window.location.reload();
            }

            if(request == true){
                console.log("tried it lol")
                const sendRequest = async() => {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    const response = await fetch("http://localhost:8800/requests", {
                    method: "POST",
                    // 
                    body: JSON.stringify({ 
                        studentID: sid,
                        teamID: teamID,
                    }),

                    headers: myHeaders,
                    });
                    if (response.ok)
                        setRequest(true);
                } 
                sendRequest();
            }

            if(deleteReq){
                console.log("tried it lol")
                const deleteRequest = async() => {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    const response = await fetch("http://localhost:8800/requests", {
                    method: "DELETE",
                    // 
                    body: JSON.stringify({ 
                        studentID: sid,
                        teamID: teamID,
                    }),

                    headers: myHeaders,
                    });
                    if (response.ok){
                        setCanReq(true);
                        setRequest(false);
                        setDelete(false);
                    }
                } 
                deleteRequest();
                fetchRequests();

            }
            return() => {
                effectRan.current = true;
            }
            
        }

    })

    return(
        <div className="tl-entry"  id="team-entry">
            {confirmShow == false && <div className="tl-info">
                <h3 className="tl-name"> {sportIcon} {name}  </h3>
                <h5>Record: {wins} W {losses} L </h5>
                {view != "League" && <p className="team-league-info"> {gender} {sport}, Level {level}</p>}
            </div>}

            <div className="entry-btns" id="league-entry-btns">
                {view=="Student" && confirmShow == false && sid!=teamObj.captainSID && <button onClick={handleLeaveClick}>Leave Team</button>}                
                {view=="Student" && confirmShow == false && sid==teamObj.captainSID && <button onClick={handleEdit}>Edit Team</button>}
                
                {/*requests*/}
                {view == "League" && !confirmShow && canReq && !request && 
                    <button className="req-btn"onClick={handleJoinRequest}>Request To Join</button>}
                {view == "League" && !confirmShow && canReq && request && 
                    <p id="req-sent">Request has been sent!</p>}
                    
                {view == "League" && !confirmShow && !canReq && !request && !deleteReq &&
                    <button className="req-btn" id="req-btn-del" onClick={handleDeleteRequest} >Delete Pending Request</button>}
                {/* {view == "League" && !confirmShow && !canReq && !request && deleteReq && 
                    <p>Request has been deleted!</p>} */}

            </div>

            {view=="Student" && confirmShow == true &&
                    <div className="confirm-changes">
                        <div id="leave-tl-name">
                            <h3>Confirm that you want to leave the team:</h3>
                            <h2>{name}</h2>
                        </div>
                        <div id="confirm-choices">
                            <button onClick={handleConfirmLeave}>Yes</button>
                            <button onClick={()=>{setConfirmShow(false)}}>No</button>
                        </div>
                    </div>
                
                }
        </div>
    )
}

TeamTableEntry.propTypes = {
    teamObj:PropTypes.object,
    view: PropTypes.string
}

const LeagueTable = ({leagues}) => {
    const indices = [...Array(leagues.length).keys()]
    const [viewingLeague, setView] = useState(false)
    const [leagueIndex, setIndex] = useState(-1)
    const [teams, setTeams] = useState([])
    return(
            <>
            {viewingLeague == false && 
                <div className="tl-table">
                    {indices.map((e) => {
                            return <LeagueTableEntry key={e} setIndex={setIndex} setView={setView} currInd={e} 
                            setTeams={setTeams} leagueObj={leagues.at(e)}></LeagueTableEntry>
                        })}

                    </div>
            }

            {viewingLeague && 
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                    
                    <h3>{leagues.at(leagueIndex).genders} {leagues.at(leagueIndex).sport}</h3>
                    <h4>Level {leagues.at(leagueIndex).skillLevel}</h4>
                    <button onClick={()=>{setView(false)}} style={{margin: "5px auto"}}>View Leagues</button>
                    <LeagueTeams leagueObj={leagues.at(leagueIndex)} teams={teams}></LeagueTeams>
                </div>
            }
            </>
    )
}

LeagueTable.propTypes = {
    leagues: PropTypes.array
}

const LeagueTableEntry = ({leagueObj, setIndex, currInd, setView, setTeams}) => {
    const sport = leagueObj.sport;
    const numTeams = leagueObj.numTeams;
    const maxTeams = leagueObj.maxTeams;
    const maxPlayers = leagueObj.maxPlayers;
    const gender = leagueObj.genders;
    const level = leagueObj.skillLevel;
    const leagueID = leagueObj.leagueID;

    const updateID = useCurrLeagueStore(useShallow((state) => state.updateID));
    const updateNumTeams = useCurrLeagueStore(useShallow((state) => state.updateNumTeams));
    const updateMaxTeams = useCurrLeagueStore(useShallow((state) => state.updateMaxTeams));
    const updateSport = useCurrLeagueStore(useShallow((state) => state.updateSport));
    const updateMaxPlayers = useCurrLeagueStore(useShallow((state) => state.updateMaxPlayers));
    const updateGenders = useCurrLeagueStore(useShallow((state) => state.updateGenders));
    const updateLevel = useCurrLeagueStore(useShallow((state) => state.updateLevel));

    const stuGender=useStudentStore((state)=>state.gender)
    const canJoinGender = useRef(true);

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

    switch(gender){
        case "Male":
            if(stuGender != "M")
                canJoinGender.current = false;
            break;
        case "Female":
            if(stuGender != "F")
                canJoinGender.current = false;
            break;
    }


    function handleClick(){
        updateID(leagueID);
        updateLevel(level)
        updateGenders(gender)
        updateSport(sport)
        updateMaxPlayers(maxPlayers)
        updateNumTeams(numTeams)
        updateMaxTeams(maxTeams)
        navigate('/createteam')
    }

    const [goingToView, setGoing] = useState(false)
    function handleJoinClick(){
        effectRan.current = false;
        setGoing(true);
        setIndex(currInd)
        //setView(true)
    }

    const effectRan = useRef(false)
    useEffect(()=>{
       if(!effectRan.current){
            if(goingToView){
                const fetchTeams = async() => {
                    {
                        const url = `http://localhost:8800/teams/league/${leagueID}`
                        const result = await fetch(url);
                        result.json().then(json => {
                            setTeams(json);
                        })
                    }
                }
                fetchTeams();
                setView(true); //now we can finally let u view teams
            }

            return()=>{
                effectRan.current = true;
            }
        }
    })


    return(
        <div className="tl-entry" id="league-entry">
            <div className="tl-info">
                <h3 className="tl-name"> {sportIcon} {gender} {sport} </h3>
                <h5>Level {level} </h5>
                <p className="team-league-info">Max players: {maxPlayers}, {numTeams}/{maxTeams} teams</p>
            </div>
            <div className="entry-btns" id="league-btns">
            {canJoinGender.current && <button onClick={handleClick}>Create Team</button>}
            {numTeams > 0 && <button onClick={handleJoinClick}>View Teams</button>}
            </div>

        </div>
    )
    
}

LeagueTableEntry.propTypes = {
    leagueObj: PropTypes.object,
    currInd: PropTypes.number,
    setView: PropTypes.func,
    setIndex: PropTypes.func,
    setTeams: PropTypes.func
}