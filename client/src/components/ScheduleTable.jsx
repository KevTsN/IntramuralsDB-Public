import { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faVolleyball, faBasketball, faFutbol, faPersonRunning,
} from '@fortawesome/free-solid-svg-icons'

import {PropTypes} from 'prop-types'


export const ScheduleTable = ({view, id}) => {

    const [loading, setLoading] = useState(true);
    const [gamesList, setGames] = useState([]);
    const effectRan = useRef(false)
    let indices = useRef([]);

    useEffect(()=>{
        if(effectRan.current == false){
            if(view == "Student"){
                if(loading){
                    const fetchGames = async() => {
                        const url = `http://localhost:8800/students/${id}/games`
                        const result = await fetch(url);
                        result.json().then(json => {
                            setGames(json)
                            indices.current = [...Array(json.length).keys()]
                            setLoading(false);
                        })
                    }
                    fetchGames();
                    effectRan.current = true;
                }
            }

            if(view == "Team"){
                if(loading){
                    const fetchGames = async() => {
                        const url = `http://localhost:8800/teams/${id}/games`
                        const result = await fetch(url);
                        result.json().then(json => {
                            setGames(json)
                            indices.current = [...Array(json.length).keys()]
                            setLoading(false);
                        })
                    }
                    fetchGames();
                    effectRan.current = true;
                }
            }

           

        }

    })

    return(
        <>
        {loading && 
        
            <div style={{margin:"auto", width: "100%"}}>
                <p>Fetching games... </p>
            </div>}
        {!loading && indices.current.length > 0 && 
            <div id = "schedule-table">
            {indices.current.map((e) => {
                        return <Game key={e} gameObj={gamesList.at(e)}></Game>
                    })}
            </div>
        }

        {!loading && indices.current.length <= 0 && 
            <div style={{margin:"auto", width: "100%"}}>
                <p>No games... FeelsBadMan </p>
            </div>
        }
        
        </>
        
    )
}

ScheduleTable.propTypes = {
    studentID: PropTypes.number
}

export const Game = ({gameObj}) => {

    let sportIcon = null;
    switch(gameObj.sport){
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


    return (
        <div className="schedule-game">
            <div id="gm-info">
                <h2>{sportIcon} {gameObj.genders} {gameObj.sport} </h2>
                <h4>{gameObj.location}, {gameObj.gameTime}</h4>
            </div>
            
            <div className="teams-playing">
                    <div id="tp-detail">
                        <div id="team-game-name"> <h3>{gameObj.homeName}</h3> </div>
                        <p style={{color: "grey"}}>Home</p>
                    </div>
                    <div id="tp-detail">
                        <div id="team-game-name"> <h3>{gameObj.awayName}</h3> </div>
                        <p style={{color: "grey"}}>Away</p>
                    </div>
            </div>
            

        </div>
    )
}

Game.propTypes = {
    gameObj: PropTypes.object
}