import React from 'react';

const ScoreCounter = (props) => {
    return (
        < div className="score-counter" >
            <p>Score: {props.scoreCounter}</p>
        </div >
    )
}

export default ScoreCounter;