import { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faVolleyball, faBasketball, faFutbol, faPersonRunning,
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom"
import { useStudentStore, useCurrLeagueStore, useCurrTeamStore } from "../Stores"
import {PropTypes} from 'prop-types'
import { useShallow } from 'zustand/react/shallow'
import { ScheduleTable } from "./ScheduleTable"



export const InviteSendTable = ({teams}) =>{
    const indices = [...Array(teams.length).keys()]
    return(
            <div className="reqs-table">
                {indices.map((e) => {
                        return <InviteSendEntry key={e} teamObj={teams.at(e)}></InviteSendEntry>
                    })}
            </div>


    )
}

InviteSendTable.propTypes = {
    teams: PropTypes.array,
}

export const InviteSendEntry = ({teamObj}) => {
    const name=teamObj.name;
    const sport = teamObj.sport;
    const wins = teamObj.wins;
    const losses=teamObj.losses;

    const teamID=teamObj.teamID;
    const currID =useCurrTeamStore((state)=>state.teamID)

    const effectRan = useRef(false)
    const [dupeInv, setDupe] = useState(false)
    const [send, setSend] = useState(false)
    const [deleteInv, setDelete] = useState(false)

    const teamInv = useRef([])

    function handleSend(){      
        setSend(true); 
        effectRan.current = false;
    }

    function handleDeleteInv(){
        setDelete(true);
        effectRan.current= false;
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

 
    useEffect(()=>{

        const fetchInvitesSent = async() => {
            {
                const url = `http://localhost:8800/team/${currID}/inv-sent`
                const result = await fetch(url);
                result.json().then(json => {
                    teamInv.current = json;
                })
            }
        }

        if(!effectRan.current){
            fetchInvitesSent();

            teamInv.current.forEach(invite => {
                console.log(invite)
                if(invite.recipientID == teamID){
                    return setDupe(true);
                }
            });

            if(send){
                const sendInvite = async() => {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    const response = await fetch("http://localhost:8800/invites", {
                    method: "POST",
                    // 
                    body: JSON.stringify({ 
                        senderID: currID,
                        recipientID: teamID,
                    }),

                    headers: myHeaders,
                    });
                    if (response.ok)
                        setSend(true);
                } 
                sendInvite();
            }

            else if(deleteInv){
                const deleteInv = async() => {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    const response = await fetch("http://localhost:8800/invites", {
                    method: "DELETE",
                    // 
                    body: JSON.stringify({ 
                        recipientID: currID,
                        teamID: teamID,
                    }),

                    headers: myHeaders,
                    });
                    if (response.ok){
                        setDupe(false);
                        setSend(false);
                        setDelete(false);
                        fetchInvitesSent();
                    }
            }
            deleteInv();
        }   
            
            return () => {
                effectRan.current = true;
            }
        }
    })

    return(
    
       <div className="tl-entry"  id="team-entry">
             <div className="tl-info">
                <h3 className="tl-name"> {sportIcon} {name}  </h3>
                <h5>Record: {wins} W {losses} L </h5>
            </div>

            <div className="entry-btns" id="league-entry-btns">
                {/*invites*/}
                {!dupeInv && !send && 
                    <button className="req-btn"onClick={handleSend}>Invite to Game </button>}
                {!dupeInv && send && 
                    <p id="req-sent">Invite has been sent!</p>}
                    
                {dupeInv && !send &&
                    <button className="req-btn" id="req-btn-del" onClick={handleDeleteInv} >Delete Pending Invite</button>}
            </div>
        </div>
    )
}

InviteSendEntry.propTypes = {
    teamObj:PropTypes.object,
}

export const InviteRecTable = ({invites}) => {
    const indices = [...Array(invites.length).keys()]
    return(

        <div className="reqs-table">
            {indices.map((e) => {
                    return <InviteRecEntry key={e} inviteObj={invites.at(e)}></InviteRecEntry>
                })}

            </div>
    )
}

InviteRecTable.propTypes = {
    invites: PropTypes.array
}

const InviteRecEntry = ({inviteObj}) => {
    const effectRan = useRef(false)
    const wins = inviteObj.senderWins;
    const losses = inviteObj.senderLosses;

    const sender = inviteObj.senderID;
    const recipient = inviteObj.recipientID;
    const name = inviteObj.senderName;

    const updateInvitesRec=useCurrTeamStore((state)=>state.updateInvitesRec)

    const [accepted, setAccept] = useState(false);
    const [declined, setDecline] = useState(false);
    
    function handleDecline(){
        
        effectRan.current = false;
        setDecline(true);
    }

    function handleAccept(){
        
        effectRan.current = false;
        setAccept(true);
    }
    

    useEffect(()=>{
        const fetchInvitesRec = async() => {
            const result = await fetch(`http://localhost:8800/team/${recipient}/inv-rec/`, {
                
            })
            result.json().then(json => {
                    updateInvitesRec(json);
                })
            }
            
        if(effectRan.current == false){
            //fetchTeamRequests();

            fetchInvitesRec();

            if(accepted){
                const acceptInvite= async() => {
                    
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    const response = await fetch("http://localhost:8800/invites", {
                    method: "PUT",
                    // 
                    body: JSON.stringify({ 
                        senderID: sender,
                        recipientID: recipient,
                    }),

                    headers: myHeaders,
                    });
                    if (response.ok){
                        fetchInvitesRec();
                    }
                }
                acceptInvite();    
                setDecline(false);
                setAccept(false);
                effectRan.current = false;
                //state should be updated?

            }
            if(declined){
                const declineInvite= async() => {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    const response = await fetch("http://localhost:8800/invites", {
                    method: "DELETE",
                    // 
                    body: JSON.stringify({ 
                        senderID: sender,
                        recipientID: recipient,
                    }),

                    headers: myHeaders,
                    });
                    if (response.ok){
                        //see difference with setting state inside func vs outside
                        setDecline(false);
                        setAccept(false);
                        effectRan.current = false;
                        fetchInvitesRec();
                    }
                }
                declineInvite();
                
                //state should be updated?
            }
            return()=>{
                effectRan.current = true;
            }
        }
    })
    return(
        <div className="reqs-entry">
            <div className="reqs-info">
                <h3>{name} </h3>
                <h4>{wins}-{losses}</h4>
            </div>
            <div className="reqs-entry-btns">
                <button onClick = {handleDecline}>Decline</button>
                <button onClick={handleAccept} style={{backgroundColor: "green"}}>Accept</button>
            </div>
        </div>
    )
     
}

InviteRecEntry.propTypes = {
    inviteObj: PropTypes.object
}
