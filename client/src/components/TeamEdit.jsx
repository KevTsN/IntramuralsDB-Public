import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faOtter} from '@fortawesome/free-solid-svg-icons'
import { useStudentStore, useCurrTeamStore, useCurrLeagueStore } from "../Stores"
import { BackBtn } from "./Back"
import { useShallow } from 'zustand/react/shallow'
import {PropTypes} from 'prop-types'

export function TeamEdit() {

    const navigate = useNavigate()

    const name=useCurrTeamStore((state)=>state.name)
    const teamID=useCurrTeamStore((state)=>state.teamID)
    const numPlayers=useCurrTeamStore((state)=>state.numPlayers)
    const wins=useCurrTeamStore((state)=>state.wins)
    const losses=useCurrTeamStore((state)=>state.losses)

    const genders=useCurrLeagueStore((state)=>state.genders)
    const sport=useCurrLeagueStore((state)=>state.sport)
    const level=useCurrLeagueStore((state)=>state.skillLevel)
    const players=useCurrTeamStore((state)=>state.playersList)
    const updatePlayers = useCurrTeamStore(useShallow((state)=> state.updatePlayers));

    //selectCaptain

    const [changesMessage, setMessage] = useState('')
    const [changeClicked, setChange] = useState(false)
    const [nameError, setNameError] = useState('')

    const [newCaptain, setNewCap] = useState(0)
    const [newName, setNewName] = useState("")
    const effectRan = useRef(false)

    const onChangeClick = () => {

    setChange(false)
    setNameError('')
    if(!/^[a-zA-Z ]{4,30}$/.test(newName)){
        setNameError('Name must be between 4 and 30 characters, with only letters and spaces.')
        return;
    }

    setChange(true)
    }
    
    useEffect(()=>{
        console.log(changeClicked)
        if(effectRan.current == false){

            console.log(teamID)
            const fetchPlayers = async() => {
                    const result = await fetch(`http://localhost:8800/players/team/${teamID}`)
                    result.json().then(json => {
                        console.log(json)
                            updatePlayers(json);
                        })
                    }
            fetchPlayers();
            
            if(changeClicked == true){
                const nc=useCurrTeamStore((state)=>state.newCapID)
                const updateTeam = async() => {
                    const response = await fetch(`http://localhost:8800/teams/:${teamID}`, {
                        method: "PUT",
                        body: JSON.stringify({ 
                            teamID: teamID,
                            captainID: nc,
                            newName: newName,
                        })
                        });
                        console.log(response)

                    if(response.ok){
                        window.location.reload();
                    }
                }
                updateTeam(); 
                //fetch update team
            
            }
            setChange(false);
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
                {/* <a className="fake-ref" href="">
                    <div className="back-button" onClick={onBack}>
                        <FontAwesomeIcon style={{marginRight: "5px"}}icon={faBackward} />
                        <h2> Back </h2>
                    </div>
                </a> */}
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

                    <div className = "input-container">
                        <label> <h3> Players</h3> </label>
                        <h5> Select a player below to change them to captain when changes are saved</h5>
                        <PlayerTable players={players}></PlayerTable>

                    </div>
                    

                <br/>   

                <div className = "input-container">
                    <div id="captain-btn-cont">
                        <button>Delete Team</button>    
                        <button>Leave Team</button>
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

const PlayerTable = ({players}) =>{

    const indices = [...Array(players.length).keys()]
    return(
            <div className="tl-table">
                {indices.map((e) => {
                        return <PlayerTableEntry key={e} playerObj={players.at(e)}></PlayerTableEntry>
                    })}
            </div>

    )
}
PlayerTable.propTypes = {
    players: PropTypes.array
}

const PlayerTableEntry = ({playerObj}) => {
    const studentID = playerObj.studentID;
    const teamID = playerObj.teamID;
    const gender = playerObj.gender;
    const first = playerObj.firstName;
    const last = playerObj.lastName;
    const newCap = useCurrTeamStore(useShallow((state)=>state.updateNewCap));

    function handleClick(){
        newCap(studentID)
        console.log("New potential captain: " + studentID)
    }

    return(
        <div className="tl-entry" id="player-entry">
            <div className="tl-info">
                <h3> {first} {last} </h3>
                <h5>Gender: {gender} </h5>
            </div>
            <button onClick={handleClick} style={{padding:"0.3em"}}>Make Captain</button>
        </div>
    )

}

PlayerTableEntry.propTypes = {
    playerObj: PropTypes.object
}