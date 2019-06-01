import React from 'react';

const SubmitButton = (props) => {
    return (
        <button className="btn submit" onClick={props.onClick}> Submit</button>
    );

}

export default SubmitButton;