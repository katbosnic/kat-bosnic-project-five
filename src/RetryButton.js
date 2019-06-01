import React from 'react';

const RetryButton = (props) => {
    return (
        <button className="btn retry" onClick={props.onClick}> Retry</button>
    );

}

export default RetryButton;