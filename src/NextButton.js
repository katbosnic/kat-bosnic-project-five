import React from 'react';

const NextButton = (props) => {
    return (
        <button className="btn next" onClick={props.onClick}>Next <i class="fas fa-arrow-right"></i></button>
    )
}

export default NextButton;