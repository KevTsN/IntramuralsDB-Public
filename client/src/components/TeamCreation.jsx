import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useStudentStore, useCurrLeagueStore } from "../Stores"
import { BackBtn } from "./Back"


export function TeamCreation() {

const navigate = useNavigate()

  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')

  const level=useCurrLeagueStore((state)=>state.skillLevel)
  const genders=useCurrLeagueStore((state)=>state.genders)
  const sport=useCurrLeagueStore((state)=>state.sport)
  const numTeams=useCurrLeagueStore((state)=>state.numTeams)
  const maxTeams=useCurrLeagueStore((state)=>state.maxTeams)
  const maxPlayers=useCurrLeagueStore((state)=>state.maxPlayers)
  const leagueID=useCurrLeagueStore((state)=>state.leagueID)
  const captainID =useStudentStore((state)=>state.studentID)


  
  const [created, setCreated] = useState(false)
  const [createdMessage, setMessage] = useState('')
  const effectRan = useRef(false)
  const onCreateClick = () => {
    console.log('cleek')
    setCreated(false)
    setNameError('')
    if(!/^[a-zA-Z ]{4,30}$/.test(name)){
        setNameError('Name must be be between 4 and 30 characters, with only letters and spaces.')
        return;
    }
    setCreated(true)
  }
  
  useEffect(()=>{
    // if(effectRan.current == false){

    if(created){
        console.log('yo')
    const createTeam = async() => {
        let calcID = Math.floor(Math.random() * 9999999) + 1000000;
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const response = await fetch("http://localhost:8800/teams", {
            method: "POST",
            // 
            body: JSON.stringify({ captainID: captainID,
                teamID: calcID,
                leagueID: leagueID,
                name: name,
            }),
            headers: myHeaders,
        });
        if(!response.ok){
                setMessage("Something went wrong creating your team. Please try again.")
                setCreated(false)
                // effectRan.current = false;
            }
            else{
                setMessage("Your team was created.")
                // effectRan.current = true;
                navigate('/home')
            }
        } 
        createTeam();
    }
// }
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
                <h2> Team Creation </h2>
                
                <div id="register">
                <div className = "input-container">
                        <label> <h3> Team Name </h3> </label>
                        <input
                        value={name}
                        placeholder="Enter your team's name"
                        onChange={(ev) => setName(ev.target.value)}
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
                        <label> <h3> More Info</h3> </label>                        
                        <h6> Max players allowed on your team: {maxPlayers}</h6>
                        <p>There will be {maxTeams-numTeams-1} team spots left in this league after you submit.</p>
                    </div>

                <br/>      


                <br/>
               {<div className={'input-container'}>
                    <input className={'input-button'} style={{width:"50%", margin: "auto"}} type="button" onClick={onCreateClick} value={'Create Team'} />
                </div>}
                <label>{createdMessage}</label>
                
            </div>
         </div>


     </div>
    )
}