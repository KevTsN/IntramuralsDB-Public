import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faBackward } from '@fortawesome/free-solid-svg-icons'


export function BackBtn({innerRef}){
    return (<a className="fake-ref" href="">
                    <div className="back-button" onClick={innerRef}>
                        <FontAwesomeIcon style={{marginRight: "5px"}}icon={faBackward} />
                        <h2> Back </h2>
                    </div>
                </a>)
}