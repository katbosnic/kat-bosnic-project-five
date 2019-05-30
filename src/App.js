import React, { Component } from 'react';
import firebase from './firebase.js';
import Radio from './Radio.js';
import GameField from './GameField.js';

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      trashItems: [],
      roundOne: [],
      roundTwo: [],
      roundThree: [],
      usersGarbageBin: [],
      usersRecyclingBin: [],
      usersOrganicBin: []
    }
  }
  componentDidMount() {
    const dbRef = firebase.database().ref();
    dbRef.on('value', (response) => {
      const trashObj = (response.val());
      this.setState({
        trashItems: trashObj.trashItemsArr
      });

      const newRoundThree = this.state.trashItems.slice(0, 6);
      const newRoundOne = this.state.trashItems.slice(6, 12);
      const newRoundTwo = this.state.trashItems.slice(12, 18);

      this.setState({
        roundOne: newRoundOne,
        roundTwo: newRoundTwo,
        roundThree: newRoundThree
      });
    });

  }

  handleChange = (event) => {
    const targetedItemVal = event.target.value
    const targetedItem = event.target.dataset.name
    // check to see if targetItem is in any of the bins 
    // if it does exist in any of the bins
    // remove targetedItem from 
    const copyGarbageBin = [...this.state.usersGarbageBin]
    const copyRecyclingBin = [...this.state.usersRecyclingBin]
    const copyOrganicBin = [...this.state.usersOrganicBin]

    this.setState({
      usersGarbageBin: copyGarbageBin,
      usersOrganicBin: copyOrganicBin,
      usersRecyclingBin: copyRecyclingBin
    })

    const checkArray = (array) => {
      for (let i = 0; i < array.length; i++) {
        if (array[i] === targetedItem) {
          array.splice(i, 1);
          // i--;
        } else {

        }
      }
    }

    checkArray(copyGarbageBin);
    checkArray(copyOrganicBin);
    checkArray(copyRecyclingBin);

    const bin = [...this.state[targetedItemVal]]
    bin.push(targetedItem)

    this.setState({
      [targetedItemVal]: bin
    })
  }

  goToNextSet = () => {
    console.log('click')
  }
  render() {
    return (
      <div className="App" >
        <header>
          <h1>Waste-Wise!</h1>
          <button className="information-btn"><i class="fas fa-info-circle"></i></button>
        </header>
        {/* <GameField
          round = {this.state.roundOne}
        /> */}
        <div className="game-field">
          <ul className="trash-card-container">
            {this.state.roundOne.map((trashItem, index) => {
              return (
                <div className="trash-card-and-inputs">

                  <Radio
                    value="usersOrganicBin"
                    name={index}
                    dataName={trashItem}
                    onChange={this.handleChange}
                  />
                  <Radio
                    value="usersRecyclingBin"
                    name={index}
                    dataName={trashItem}
                    onChange={this.handleChange}
                  />

                  <Radio
                    value="usersGarbageBin"
                    name={index}
                    dataName={trashItem}
                    onChange={this.handleChange}
                  />
                  <li className="trash-card" key={index}>
                    <p>{trashItem}</p>
                  </li>
                </div>
              )
            })}
          </ul>
          <div className="proceed-buttons">
            {/* <button><i class="fas fa-arrow-left"></i> Back</button> */}
            <button onClick={this.goToNextSet}>Next <i class="fas fa-arrow-right"></i></button>
          </div>
        </div>
      </div >
    );
  }
}

export default App;
