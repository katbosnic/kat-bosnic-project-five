import React, { Fragment } from 'react';

const Radio = (props) => {
    return (
        <Fragment>
            <input
                aria-label={props.action + props.dataName + props.typeOfBin}
                type="radio"
                name={props.name}
                value={props.value}
                data-name={props.dataName}
                onChange={props.onChange}
                id={props.id + props.dataName}
                checked={props.checked}
            />
            <label htmlFor={props.id + props.dataName}></label>
        </Fragment >
    )
}

export default Radio;