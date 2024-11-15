
import { useEffect, useState, useRef} from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceFrown } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom"
import { useStudentStore } from "../Stores"
import { useShallow } from 'zustand/react/shallow'

export function LogOut(){

    const updateID = useStudentStore(useShallow((state) => state.updateID))
    const updateGender = useStudentStore(useShallow((state) => state.updateGender))
    const updateFirst = useStudentStore(useShallow((state) => state.updateFirst))
    const updateLast = useStudentStore(useShallow((state) => state.updateLast))
    const updateLeagues = useStudentStore(useShallow((state) => state.updateLeagues))
    const updateTeams = useStudentStore(useShallow((state) => state.updateTeams))

    const navigate = useNavigate()
    const effectRan = useRef(false)
    useEffect(()=>{
        if(!effectRan.current){
            updateGender('')
            updateFirst('')
            updateLast('')
            updateID(0)
            updateTeams([])
            updateLeagues([])
            localStorage.removeItem("fullName")
            sessionStorage.clear()
            setTimeout(() => {
                navigate('/')
              }, "2000");

              return()=>{
                effectRan.current = true;
            }
        }
        
    })
    // redirects after 2 seconds lol

    return(
        <div className="content" style={{alignItems: "center", width: "90%"}}>
            <div id="logout-cont">
                <h1>Carleton University Intramurals</h1>
                <h2>Logging out...</h2>
                <img src="logout-panda.jpg"></img>
                <p> just like they did </p>
                <FontAwesomeIcon icon={faFaceFrown} />
            </div>
            
        </div>
    )
}