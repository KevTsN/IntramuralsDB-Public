
import { useState, useEffect, useRef } from "react"
import {TeamTableEntry} from './TeamTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faVolleyball, faBasketball, faFutbol, faPersonRunning} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom"
import { useStudentStore, useCurrLeagueStore, useCurrTeamStore } from "../Stores"
import {PropTypes} from 'prop-types'
import { useShallow } from 'zustand/react/shallow'

export const LeagueTeams = ({leagueObj, teams}) => {
    const sport = leagueObj.sport;
    const numTeams = leagueObj.numTeams;
    const maxTeams = leagueObj.maxTeams;
    const maxPlayers = leagueObj.maxPlayers;
    const gender = leagueObj.genders;
    const level = leagueObj.skillLevel;
    const leagueID = leagueObj.leagueID
    let indices = [...Array(teams.length).keys()]
    const effectRan = useRef(false);
    
    useEffect(()=>{
        if(!effectRan.current){
            // const fetchTeams = async() => {
            //     {
            //         const url = `http://localhost:8800/teams/league/${leagueID}`
            //         const result = await fetch(url);
            //         result.json().then(json => {
            //             setTeams(json)
            //         })
            //     }
            // }
            // fetchTeams();
            
            return()=>{
                effectRan.current = true;
            }
        }
    })
    return(
        <>
            {effectRan.current && indices.map((e) => {
                return <TeamTableEntry key={e} view="League" teamObj={teams.sort(({wins:a}, {wins:b}) => b-a).at(e)}></TeamTableEntry>
            })}
        </>
    )
}

LeagueTeams.propTypes={
    leagueObj: PropTypes.object,
    teams: PropTypes.array
}