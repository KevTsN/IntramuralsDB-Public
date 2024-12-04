import { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faVolleyball, faBasketball, faFutbol, faPersonRunning,
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom"
import { useStudentStore, useCurrLeagueStore, useCurrTeamStore } from "../Stores"
import {PropTypes} from 'prop-types'
import { useShallow } from 'zustand/react/shallow'
import { ScheduleTable } from "./ScheduleTable"



export const TeamTable = ({teams, view}) =>{
    const indices = [...Array(teams.length).keys()]
    const [viewSched, setSched] = useState(false)
    const sid =useStudentStore((state)=>state.studentID)

    return(
        <div className="t-table-full">

            {view == "Student" && <h2 style={{textAlign: "left", marginBottom: "10px", width: "100%"}}> Manage Teams </h2>}
            <div className="tl-table">
                {indices.map((e) => {
                        return <TeamTableEntry key={e} view={view} teamObj={teams.at(e)}></TeamTableEntry>
                    })}
            </div>

            {view == "Student" &&   
                <button style={{margin:"15px auto"}} onClick={()=>{setSched(!viewSched)}}> Toggle Viewing Schedules </button>}
            {viewSched && view=="Student" && 
                <ScheduleTable view="Student" id={sid}></ScheduleTable>
            }
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
    const stuGen =useStudentStore((state)=>state.gender)
    const reqs =useStudentStore((state)=>state.outRequests)
    const updateRequests =useStudentStore((state)=>state.updateRequests)
    const stuTeams =useStudentStore((state)=>state.teams)
    const updateTeams =useStudentStore((state)=>state.updateTeams)




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
    const [dupeReq, setDupeReq] = useState(false);
    const [deleteReq, setDelete] = useState(false)
    const [canReq, setCanReq] = useState(true);

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
    switch(sport.toUpperCase()){
        case "SOCCER":
            sportIcon = <FontAwesomeIcon icon={faFutbol}> </FontAwesomeIcon>
            break;
        case "BASKETBALL":
            sportIcon = <FontAwesomeIcon icon={faBasketball}></FontAwesomeIcon>
            break;
        case "VOLLEYBALL":
            sportIcon = <FontAwesomeIcon icon={faVolleyball}></FontAwesomeIcon>
            break;
        default:
            sportIcon = <FontAwesomeIcon icon={faPersonRunning} />;
            break;
        }

    const effectRan = useRef(false)
    useEffect(()=>{
        if(!effectRan.current){
            switch(gender){
                case "Male":
                    if(stuGen != "M"){
                        setCanReq(false);  
                    }
                    break;
                case "Female":
                    if(stuGen != "F"){
                        setCanReq(false);  
                }
                break;
            }

            //this finna be some ass bruh
            stuTeams.forEach(team => {
                if(team.teamID == teamID){
                    return setCanReq(false);
                }
            });

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
                    return setDupeReq(true);
                }
            });
            if(editClicked){
                const fetchPlayers = async() => {
                        const result = await fetch(`http://localhost:8800/players/team/${teamID}`, {
                            
                        })
                        result.json().then(json => {
                                updatePlayers(json);
                            })
                        }
                    fetchPlayers();

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
                } 
                leaveTeam();
                setLeaveConfirm(false);
                fetchTeams();
                //window.location.reload();
            }

            if(request == true){
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
                        setDupeReq(false);
                        setRequest(false);
                        setDelete(false);
                        fetchRequests();
                    }
                } 
                deleteRequest();
                // fetchTeams();
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
                {view == "League" && canReq && !confirmShow && !dupeReq && !request && 
                    <button className="req-btn"onClick={handleJoinRequest}>Request To Join</button>}
                {view == "League" && !confirmShow && !dupeReq && request && 
                    <p id="req-sent">Request has been sent!</p>}
                    
                {view == "League" && canReq && !confirmShow && dupeReq && !request && !deleteReq &&
                    <button className="req-btn" id="req-btn-del" onClick={handleDeleteRequest} >Delete Pending Request</button>}
                {/* {view == "League" && !confirmShow && !dupeReq && !request && deleteReq && 
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