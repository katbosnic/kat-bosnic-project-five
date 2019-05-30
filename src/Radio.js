import React from 'react';

const Radio = (props) => {
    return (
        <input type="radio"
            name={props.name}
            value={props.value}
            data-name={props.dataName}
            onChange={props.onChange}
        />
    )
}

export default Radio;