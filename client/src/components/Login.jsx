import { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faBackward } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom"
import { findLogIn } from "../ApiFunctions"
import { useStudentStore } from "../Stores"
export function LogIn() {

    const navigate = useNavigate()

  const [number, setNumber] = useState('')
  const [password, setPassword] = useState('')
  const [numberError, setStudentError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [visible, setVisibility] = useState(true)

  const [attemptMessage, setMessage] = useState('')

  const updateID = useStudentStore((state) => state.updateID)
  const updateGender = useStudentStore((state) => state.updateGender)
  const updateFirst = useStudentStore((state) => state.updateFirst)
  const updateLast = useStudentStore((state) => state.updateLast)
  const updateTeams = useStudentStore((state) => state.updateTeams)


  const [attempted, setAttempted] = useState(false)


  const onLoginClick = () => {
    setMessage('')
    setStudentError('')
    setPasswordError('')

    if ('' === number) {
        setStudentError('Please enter your student number')
        return;
      }
    
      if (!/^[1-9][0-9]{8}$/.test(number)) {
        setStudentError('Please enter a valid student number')
        return
      }
    
      if ('' === password) {
        setPasswordError('Please enter a password')
        return
      }
    
      if (password.length < 7) {
        setPasswordError('The password must be 8 characters or longer')
        return;
      }

      setStudentError('')
      setPasswordError('')

      setAttempted(true)

  }

  const onEyeClick = () => {
    setVisibility(!visible)
  }

  function onBack() {
    navigate('/')
  }
  const effectRan = useRef(false)
  useEffect(()=>{

        if(attempted){
            const fetchUser = async() => {
                {
                    const url = `http://localhost:8800/students/${number}/&password=${password}`
                    const result = await fetch(url);
                    result.json().then(json => {
                        let jason=json[0]
                        if(jason){
                            setMessage('Login successful')
                            updateGender(jason.gender)
                            updateFirst(jason.firstName)
                            updateLast(jason.lastName)
                            updateID(jason.studentID)
                            localStorage.setItem("fullName", `${jason.firstName} ${jason.lastName}`)
                            navigate('/home')
    
                          }
                          else{
                            setMessage('Login unsuccessful')
                          } 
                    })
                }
            }
            fetchUser();
            
        }

  })

    return(

        <div className="content" style={{alignItems: "center", width: "90%"}}>

            <div id="login-left">
                <a className="fake-ref" href="">
                    <div className="back-button" onClick={onBack}>
                        <FontAwesomeIcon style={{marginRight: "5px"}}icon={faBackward} />
                        <h2> Back </h2>
                    </div>
                </a>
               

                <h1>Carleton University</h1>
                <h1>Intramurals</h1>
                <h2> Log-in </h2>
                
                <div id="login">
                    <div className = "input-container">
                        
                        <input
                        value={number}
                        placeholder="Enter your student number"
                        onChange={(ev) => setNumber(ev.target.value)}
                        className="input-box"
                        />
                        <label>{numberError}</label>
                    </div>
                <br/>
                <div className="input-container">
                    <input
                    value={password}
                    placeholder="Enter your password here"
                    onChange={(ev) => setPassword(ev.target.value)}
                    className="input-box"
                    id="passweezy"
                    type={visible ? "password" : "text"}
                    />
                    
                    <div id="eyecon">
                        <FontAwesomeIcon style={{color:"black", height: "1.5em"}} icon={faEye} onClick={onEyeClick}/>
                    </div>

                    <label>{passwordError}</label>
                </div>

                <br/>
                <div className={'input-container'}>
                    <input className={'input-button'} style={{width:"50%", margin: "auto"}} type="button" onClick={onLoginClick} value={'Log in'} />
                    <label>{attemptMessage}</label>
                </div>
            </div>
         </div>

        <div style={{width: "30%"}} id="hey-rodney">
            <div id="rodney-cont">
                <img style={{margin: "auto"}}src="/rodney-talking.png"/>
            </div>
        </div>

     </div>
    )
}