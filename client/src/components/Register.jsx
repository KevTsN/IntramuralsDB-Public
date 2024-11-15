import { useState, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faBackward } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom"
import { apiRegister } from "../ApiFunctions"
// const sqlite3 = require('sqlite3').verbose(); //verbose provides more detailed stack trace
// const db = new sqlite3.Database('sql/database');
// db.all("SELECT * FROM users", function(err, rows) {})
export function Register() {

    const navigate = useNavigate()

  const [number, setNumber] = useState('')
  const [password, setPassword] = useState('')

  const [numberError, setStudentError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [gender, setGender] = useState('')
  const [customGender, setCustomGender] = useState('')
  const [genderError, setGenderError] = useState('')

  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [firstError, setFirstError] = useState('')
  const [lastError, setLastError] = useState('')


  const [visible, setVisibility] = useState(true)
  const [filled, setFilled] = useState(false)
  const [registered, setRegistered] = useState(false)
  const onRegisterClick = () => {
    setRegistered(false)

    if('' === first){
        setFirstError('Please enter your first name')
        return;
    }
    if(!/^[A-Za-z]{2,15}$/.test(first)){
        setFirstError('First name must be between 2 and 15 letters.')
        return
    }


    if('' === last){
        setLastError('Please enter your last name')
        return;
    }
    if(!/^[A-Za-z]{3,15}$/.test(last)){
        setLastError('Last name must be between 3 and 15 letters.')
        return
    }

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
      if(!gender){
        setGenderError('Please select a gender.')
      }
      setPasswordError('')
      setStudentError('')
      setGenderError('')
      setFirstError('')
      setLastError('')
      setRegistered(true)
      let gChar = gender.charAt(0)
    //   const hashPw = cryptPassword(password) 
      const fn = `${first} ${last}`
      const numberInt = parseInt(number)
      apiRegister(numberInt, password,gChar,first,last)
      navigate('/login')
  }
  

  const onGenderClick = (givenGender) => {
    switch(givenGender){
        case "Male":
            setGender("Male");
            break;
        case "Female":
            setGender("Female");
            break;
        case "Other":
            setGender("Other");
            break;
              
    }
  }

  const onEyeClick = () => {
    setVisibility(!visible)
  }

  function onBack() {
    navigate('/')
  }

  useEffect(()=>{
    
    if(gender && first && last && !passwordError && !numberError && gender && password)
        setFilled(true);

    //for when everything is filled, show register button
  }, [setFilled, first, last, gender, password, passwordError, numberError, setStudentError, setPasswordError] )

    return(

        <div className="content" style={{alignItems: "center", width: "85%", marginTop: "20px"}}>

            <div id="regista">
                <a className="fake-ref" href="">
                    <div className="back-button" onClick={onBack}>
                        <FontAwesomeIcon style={{marginRight: "5px"}}icon={faBackward} />
                        <h2> Back </h2>
                    </div>
                </a>
               

                <h1>Carleton University</h1>
                <h1>Intramurals</h1>
                <h2> Register </h2>
                
                <div id="register">
                    <p> Fill in all fields to register. </p>
                <div className = "input-container">
                        <label> <h3> First name </h3> </label>
                        <input
                        value={first}
                        placeholder="Enter your first name"
                        onChange={(ev) => setFirst(ev.target.value)}
                        className="input-box"
                        />
                    </div>

                    <div className = "input-container">
                        <label> <h3> Last name </h3> </label>
                        <input
                        value={last}
                        placeholder="Enter your last name"
                        onChange={(ev) => setLast(ev.target.value)}
                        className="input-box"
                        />
                    </div>


                    <div className = "input-container">
                        <label> <h3> Student number </h3> </label>
                        <input
                        value={number}
                        placeholder="Enter your student number"
                        onChange={(ev) => setNumber(ev.target.value)}
                        className="input-box"
                        />
                        <label>{numberError}</label>
                    </div>

                <div className="input-container">
                    <label> <h3> Password </h3> </label>
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

                <div className = "gender-container">
                <label style={{width: "max-content"}}> <h3> Gender </h3> </label>
                    
                    <div className="gender-button-cont">

                        <span className="gender-button" style={{display: 'flex'}}>
                            Male
                            <input type="radio" className="gender-radio" name="gender" onClick={()=>onGenderClick("Male")} value="Male">
                            </input>
                        </span>
                        <span className="gender-button" style={{display: 'flex'}}>
                            Female
                            <input type="radio" className="gender-radio" name="gender" onClick={()=>onGenderClick("Female")}  value="Female">
                            </input>
                        </span>
                        <span className="gender-button" style={{display: 'flex'}}>
                            Other
                            <input type="radio" className="gender-radio" name="gender" onClick={()=>onGenderClick("Other")} value="Other">
                            </input>
                        </span>

                    </div>

            {gender == "Other" &&  
                    <div style={{width:"60%"}}>
                    
                        <div className = "input-container">
                        <input
                        value={customGender}
                        placeholder="Gender (optional)"
                        onChange={(ev) => setCustomGender(ev.target.value)}
                        className="input-box"
                        />

                        </div>
                    </div>
                        }
                    <label>{genderError}</label>
                </div>

                <br/>
               {<div className={'input-container'}>
                    <input className={'input-button'} style={{width:"50%", margin: "auto"}} type="button" onClick={onRegisterClick} value={'Register'} />
                </div>}
                {registered && <label>Registered. Redirecting to home...</label>}
            </div>
         </div>


     </div>
    )
}