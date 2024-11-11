import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useStudentStore, useCurrTeamStore, useCurrLeagueStore } from "../Stores"
import { BackBtn } from "./Back"

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

    
      
     
      const effectRan = useRef(false)
      const onEditClick = () => {

      }
      
      useEffect(()=>{
        // if(effectRan.current == false){
    
        if(created){
            console.log('yo')
        const createTeam = async() => {
            let calcID = Math.floor(Math.random() * 9999999) + 1000000;
            const myHeaders = new Headers();
            console.log(calcID)
            myHeaders.append("Content-Type", "application/json");
            const response = await fetch("http://localhost:8800/teams", {
                method: "POST",
                // 
                body: JSON.stringify({ 
                    captainID: capID,
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