import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faOtter, faFaceSadCry, faStar, faCircleChevronDown, faCircleChevronUp} from '@fortawesome/free-solid-svg-icons'
import { useStudentStore, useCurrTeamStore, useCurrLeagueStore } from "../Stores"
import { BackBtn } from "./Back"
import { useShallow } from 'zustand/react/shallow'
import {PropTypes} from 'prop-types'

export function TeamEdit() {

    const navigate = useNavigate()

    const studentID=useStudentStore((state)=>state.studentID)
    const name=useCurrTeamStore((state)=>state.name)
    const teamID=useCurrTeamStore((state)=>state.teamID)
    const numPlayers=useCurrTeamStore((state)=>state.numPlayers)
    const wins=useCurrTeamStore((state)=>state.wins)
    const losses=useCurrTeamStore((state)=>state.losses)
    const requests=useCurrTeamStore((state)=>state.requestsList)
    const updateTeamRequests=useCurrTeamStore((state)=>state.updateRequests)

    const genders=useCurrLeagueStore((state)=>state.genders)
    const sport=useCurrLeagueStore((state)=>state.sport)
    const level=useCurrLeagueStore((state)=>state.skillLevel)
    const players=useCurrTeamStore((state)=>state.playersList)
    const updatePlayers = useCurrTeamStore(useShallow((state)=> state.updatePlayers));

    const [deleteClicked, setDeleteClick] = useState(false)
    const [confDelete, setConfDelete] = useState(false)

    //selectCaptain

    const [changesMessage, setMessage] = useState('')
    const [changeClicked, setChange] = useState(false)
    const [nameError, setNameError] = useState('')

    const [newName, setNewName] = useState(name)
    const effectRan = useRef(false)
    const [captainChange, capChanger] = useState(useCurrTeamStore(useShallow((state)=>state.captainSID)))

    const [reqShow, setReqShow] = useState(false)
    const onChangeClick = () => {

    setChange(false)
    setNameError('')
    if(!/^[a-zA-Z ]{4,30}$/.test(newName)){
        setNameError('Name must be between 4 and 30 characters, with only letters and spaces.')
        return;
    }

    setChange(true)
    effectRan.current = false;
    }

    const onDeleteClick = () => {
        setDeleteClick(true);
        effectRan.current = false;
    }

    const onDeleteConfirm = () => {
        setConfDelete(true);
        effectRan.current = false;
    }
    
    useEffect(()=>{
        console.log(captainChange)

        if(effectRan.current == false){
            var youAreNotCaptain = false;

            const fetchPlayers = async() => {
                    const result = await fetch(`http://localhost:8800/players/team/${teamID}`)
                    result.json().then(json => {
                            updatePlayers(json);

                            json.forEach(player => {
                                if(player.studentID == studentID)
                                    youAreNotCaptain = true;
                            });

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

            if(youAreNotCaptain){
                effectRan.current = true;
                navigate('/home')
                return;
            }
            //save changes
            if(changeClicked == true){
                const updateTeam = async() => {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    let mate = 0

                    if(newName!=name){
                        mate = newName;
                    }

                    const response = await fetch(`http://localhost:8800/teams/:${teamID}`, {
                        method: "PUT",
                        body: JSON.stringify({ 
                            teamID: teamID,
                            captainID: captainChange,
                            newName: mate,
                            }),
                            headers: myHeaders
                        });          
                }
                updateTeam(); 
                //fetch update team
                setMessage("Updating team")
                setTimeout(()=>{
                    navigate('/home')

                }, "2 seconds")
                setChange(false);
                effectRan.current = true;
            }  
            //deleting
            else if(confDelete == true){
                const deleteTeam = async() => {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    const response = await fetch(`http://localhost:8800/teams/`, {
                        method: "DELETE",
                        body: JSON.stringify({ 
                            teamID: teamID
                            }),
                            headers: myHeaders
                        });          
                }
                deleteTeam(); 
                //fetch update team
                setMessage("Deleting team")
                setTimeout(()=>{
                    navigate('/home')

                }, "3 seconds")
                setChange(false);
                effectRan.current = true;
            }
            
        return() => {
            effectRan.current = true;
            }
        } 
    })
        
    function onBack() {
        navigate('/home')
    }

    //getrandomint, show league id, say to keep secret

    return(

        <div className="content" style={{alignItems: "center", width: "85%", marginTop: "20px"}}>

            <div id="regista">

                <BackBtn innerRef={onBack}></BackBtn>
                

                <h1>Carleton University</h1>
                <h1>Intramurals</h1>
                <h2> Team Edit </h2>
                
                <div id="register">
                <div className = "input-container">
                        <label> <h3> Team Name </h3> </label>
                        <label>{name}</label>
                        <input
                        defaultValue={name}
                        placeholder="Enter your team's new name"
                        onChange={(ev) => setNewName(ev.target.value)}
                        className="input-box"
                        />
                        <label>{nameError}</label>

                    </div>

                    <div className = "input-container">
                        <label> <h3> Sport</h3> </label>
                        <h5>{genders} {sport}</h5>
                        <h4> Level {level} </h4>
                    </div>

                    <div className = "input-container">
                        <label> <h3> Your Team ID</h3> </label>
                        <h5 style={{fontWeight: "bold"}}> <FontAwesomeIcon icon={faOtter} /> {teamID}</h5>
                        <h4> Keep this ID safe, as you may need to provide it to any new members who want to join. </h4>
                    </div>

                    <div className = "input-container-space">
                        <label> <h3> Requests 
                            {reqShow && <FontAwesomeIcon id="toggle-join" icon={faCircleChevronUp} onClick={()=>{setReqShow(!reqShow)}} />}
                            {!reqShow && <FontAwesomeIcon id="toggle-join" icon={faCircleChevronDown} onClick={()=>{setReqShow(!reqShow)}} />}
                                </h3> 
                        </label>
                        {reqShow && <RequestTable requests={requests} > </RequestTable>}
                    </div>

                    <div className = "input-container-space">
                        <label> <h3> Players</h3> </label>
                        <h5> Select a player below to change them to captain when changes are saved.</h5>
                        <PlayerTable players={players} capChanger={capChanger}></PlayerTable>
                        <p style={{marginTop: "10px"}}>If you wish to leave this team, you must set another captain first then leave in home, or delete the team with only you in it.
                        </p>

                    </div>

                <div className = "input-container">
                    <div id="captain-btn-cont">
                        {deleteClicked == false && <button onClick={onDeleteClick}>Delete Team</button>}    
                        {deleteClicked &&
                        <>
                            <button onClick={onDeleteConfirm}>Press Again to Confirm</button>
                            <button id="cancel-team-del" onClick={()=>{setDeleteClick(false)}}> Cancel </button>
                        </>
                        }
                        
                    </div>
                    
                </div>   


                <br/>
                {<div className={'input-container'}>
                    <input className={'input-button'} style={{width:"50%", margin: "auto"}} type="button" onClick={onChangeClick} value={'Save Changes'} />
                </div>}
                <label>{changesMessage}</label>
                
            </div>
            </div>


        </div>
    )
}

const PlayerTable = ({players, capChanger}) =>{

    const [highlighted, setHighlighted] = useState(-1)

    // const updateCap = useCurrTeamStore(useShallow((state)=>state.updateCaptainSID))
    // const currentCap = useCurrTeamStore(useShallow((state)=>state.captainSID));

    const indices = [...Array(players.length).keys()]
    // useEffect(()=>{
    //     updateCap(captainChange);
    //     console.log("new cap is " + currentCap)
    // })
    return(
            <div className="tl-table">
                {indices.map((e) => {

                                if(highlighted == e)
                                    return <PlayerTableEntry key={e} ind={e} highlighted={true}
                                    stateChanger={setHighlighted} capChanger={capChanger} playerObj={players.at(e)}></PlayerTableEntry>
                                else
                                    return <PlayerTableEntry key={e} ind={e} highlighted={false} 
                                    stateChanger={setHighlighted} capChanger={capChanger} playerObj={players.at(e)}></PlayerTableEntry>
                                                    
                    })}
                {indices.length == 0 &&
                    <div className="tl-entry">
                        <p>There are no other players in this team. <FontAwesomeIcon icon={faFaceSadCry} /></p>
                    </div>
                }
            </div>

    )
}
PlayerTable.propTypes = {
    players: PropTypes.array
}

const PlayerTableEntry = ({playerObj, stateChanger, capChanger, ind, highlighted}) => {
    const studentID = playerObj.studentID;
    const teamID = playerObj.teamID;
    const gender = playerObj.gender;
    const first = playerObj.firstName;
    const last = playerObj.lastName;
    const oldCap = useRef(useCurrTeamStore(useShallow((state)=>state.captainSID)));
    
    let displayGender = ""
    switch(gender){
        case "M":
            displayGender = "Male";
            break;
        case "F":
            displayGender = "Female";
            break;
        default:
            displayGender = "Other";
            break; //lol
    }
    function handleClick(){
        if(highlighted){
            stateChanger(-1)
            capChanger(oldCap.current)
        }
        else {

            stateChanger(ind)
            capChanger(studentID)
        }    
    }

   

    return(
        <div className="tl-entry" id="player-entry">
            <div className="tl-info">
                <h3> {first} {last} {highlighted && <FontAwesomeIcon icon={faStar} />}</h3>
                <h5>Gender: {displayGender} </h5>
            </div>
            <button onClick={handleClick} style={{padding:"0.3em"}}>Toggle Captain</button>
        </div>
    )

}

PlayerTableEntry.propTypes = {
    playerObj: PropTypes.object,
    stateChanger: PropTypes.func,
    ind: PropTypes.number,
    highlighted: PropTypes.bool
}

const RequestTable = ({requests}) => {
    const indices = [...Array(requests.length).keys()]
    console.log(requests)
    return(

        <div className="reqs-table">
            {indices.map((e) => {
                    return <RequestTableEntry key={e} requestObj={requests.at(e)}></RequestTableEntry>
                })}

            </div>
    )
}

RequestTable.propTypes = {
    requests: PropTypes.array
}

const RequestTableEntry = ({requestObj}) => {
    const effectRan = useRef(false)
    const datetime = requestObj.requestTime.split('T')[0];
    const name = `${requestObj.firstName} ${requestObj.lastName}`
    const studentID =  requestObj.studentID;
    const teamID = requestObj.teamID

    const updatePlayers = useCurrTeamStore(useShallow((state)=> state.updatePlayers));
    const updateTeamRequests=useCurrTeamStore((state)=>state.updateRequests)


    let gender = "";
    switch(requestObj.gender){
        case "M":
            gender = "Male";
            break;
        case "F":
            gender="Female";
            break;
        default:
            gender = "Other";
    }

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
        if(effectRan.current == false){

            const fetchTeamRequests = async() => {
                const result = await fetch(`http://localhost:8800/team/${teamID}/requests/`, {
                    
                })
                result.json().then(json => {
                    console.log(json)
                        updateTeamRequests(json);
                    })
                }
            const fetchPlayers = async() => {
                const result = await fetch(`http://localhost:8800/players/team/${teamID}`)
                result.json().then(json => {
                        updatePlayers(json);
                    })
                }
            //fetchTeamRequests();

            if(accepted){
                const acceptRequest= async() => {
                    
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    const response = await fetch("http://localhost:8800/requests", {
                    method: "PUT",
                    // 
                    body: JSON.stringify({ 
                        studentID: studentID,
                        teamID: teamID,
                    }),

                    headers: myHeaders,
                    });
                    if (response.ok){
                        fetchTeamRequests();
                        fetchPlayers();
                    }
                }
                acceptRequest();    
                //state should be updated?

            }
            if(declined){
                const declineRequest= async() => {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    console.log("green fn")
                    const response = await fetch("http://localhost:8800/requests", {
                    method: "DELETE",
                    // 
                    body: JSON.stringify({ 
                        studentID: studentID,
                        teamID: teamID,
                    }),

                    headers: myHeaders,
                    });
                    if (response.ok){
                        fetchTeamRequests();
                    }
                }
                declineRequest();
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
                <h4>{datetime}</h4>
            </div>
            <div className="reqs-entry-btns">
                <button onClick = {handleDecline}>Decline</button>
                <button onClick={handleAccept} style={{backgroundColor: "green"}}>Accept</button>
            </div>
        </div>
    )
     
}

RequestTableEntry.propTypes = {
    requestObj: PropTypes.object
}