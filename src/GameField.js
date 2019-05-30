// import React from 'react';

// const GameField = (props) => {
//     return (
//         <div className="game-field">
//             <ul className="trash-card-container">
//                 {props.round.map((trashItem, index) => {
//                     return (
//                         <div className="trash-card-and-inputs">
//                             <input type="radio"
//                                 name={index}
//                                 value="usersOrganicBin"
//                                 data-name={trashItem}
//                                 onChange={this.handleChange}
//                             />
//                             <input type="radio"
//                                 name={index}
//                                 value="usersRecyclingBin"
//                                 data-name={trashItem}
//                                 onChange={this.handleChange}
//                             />
//                             <input type="radio"
//                                 name={index}
//                                 value="usersGarbageBin"
//                                 data-name={trashItem}
//                                 onChange={this.handleChange}
//                             />
//                             <li className="trash-card" key={index}>
//                                 <p>{trashItem}</p>
//                             </li>
//                         </div>
//                     )
//                 })}
//             </ul>
//             <div className="buttons">
//                 {/* <button><i class="fas fa-arrow-left"></i> Back</button> */}
//                 <button>Next <i class="fas fa-arrow-right"></i></button>
//             </div>
//         </div>
//     )
// }

// export default GameField;