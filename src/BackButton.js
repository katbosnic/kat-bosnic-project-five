import React from 'react';

const BackButton = (props) => {
    return (
        <button className="btn previous" onClick={props.onClick}><i class="fas fa-arrow-left"></i> Back</button>
    );

}

export default BackButton;