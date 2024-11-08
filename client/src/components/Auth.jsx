import { useNavigate } from "react-router-dom";

export function Auth() {

    const navigate = useNavigate();
    const handleLogin = () => {
      navigate('/login')
    }
    const handleRegister = () => {
      navigate('/register')
    }
    return(
      <>
      <div className = "content">
        {/* main container */}
        <div id="welcome-left">
            <h1> Carleton University Intramurals </h1>
            <img  src="/outline-ravens.png" style={{maxWidth: "300px", maxHeight: "400px", margin:"auto"}} ></img>
        </div>

        <div id="welcome-right">
            <div id="welcome-text">
              <h3> Welcome to the Carleton University Intramurals portal! </h3>
            </div>
            <button onClick={handleLogin}>Log In </button>
            <button onClick={handleRegister}> Register </button>
            <img  src="/Sport_balls.png" style={{maxWidth: "300px", margin:"auto"}} ></img>
        </div>
      </div>
      </>
    );
  }