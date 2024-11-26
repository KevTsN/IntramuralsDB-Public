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
import { TeamTable } from "./TeamTable"


export function Home(){

    const navigate = useNavigate()
    

    const teams=useStudentStore((state)=>state.teams)
    const updateTeams = useStudentStore((state) => state.updateTeams)
    const leagues=useStudentStore((state)=>state.leagues)
    const updateLeagues = useStudentStore((state) => state.updateLeagues)
    const updateRequests =useStudentStore((state)=>state.updateRequests)

    // const stuGen=useStudentStore((state)=>state.gender)

    const sid =useStudentStore((state)=>state.studentID)


   
    function onLogOut() {
        navigate('/logout')
      }

    const [leagueShow, setLeagueShow] = useState(false)
    //keep as string for sql query

    // const [numTeams,setNumTeams] = useState(teams.length); //for rerendering i suppose

    const fullName = localStorage.getItem("fullName")

    //console.log(teams)

    const effectRan = useRef(false)

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

        return()=>{
            effectRan.current = true;
        }
    
        }
        
    })


    return(
        <div className="content" style={{alignItems: "center"}}>
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
    const stuTeams=useStudentStore((state)=>state.teams)

    const canJoinGender = useRef(true);
    const notInLeague = useRef(true);
    const navigate = useNavigate()

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
        stuTeams.forEach(element => {
            console.log(element)
            console.log(leagueID)
            if(element.leagueID == leagueID){
                notInLeague.current = false;
                return;
            }
        });




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



        stuTeams.forEach(element => {
            if(element.leagueID == leagueID){
                notInLeague.current = false;
                return;
            }
        });


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
            {canJoinGender.current && notInLeague.current && <button onClick={handleClick}>Create Team</button>}
            {/* {canJoinGender.current == false && <p>Ineligible to join.</p>} */}
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


