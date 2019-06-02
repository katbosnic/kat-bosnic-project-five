import React, { Component } from 'react';
import firebase from './firebase.js';
import Radio from './Radio.js';
import NextButton from './NextButton.js';
import BackButton from './BackButton.js';
import SubmitButton from './SubmitButton.js';
import RetryButton from './RetryButton.js';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      trashItems: [],
      garbageItems: [],
      recyclingItems: [],
      organicItems: [],
      roundOne: [],
      roundTwo: [],
      roundThree: [],
      currentRound: 'roundOne',
      round: [],
      usersGarbageBin: [],
      usersRecyclingBin: [],
      usersOrganicBin: [],
      showPreviousButton: false,
      showSubmitButton: false,
      showNextButton: true,
      showInfo: false,
      showRetry: false,
      score: 0
    }
  }

  componentDidMount() {
    const dbRef = firebase.database().ref();
    dbRef.on('value', (response) => {
      const trashObj = (response.val());
      this.setState({
        trashItems: trashObj.trashItemsArr,
        garbageItems: trashObj.garbageBinArr,
        recyclingItems: trashObj.recyclingBinArr,
        organicItems: trashObj.wasteWiseBinArr
      });

      const newRoundThree = this.state.trashItems.slice(0, 6);
      const newRoundOne = this.state.trashItems.slice(6, 12);
      const newRoundTwo = this.state.trashItems.slice(12, 18);

      this.setState({
        round: newRoundOne,
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
      usersRecyclingBin: copyRecyclingBin,
    })

    const checkArray = (array) => {
      for (let i = 0; i < array.length; i++) {
        if (array[i] === targetedItem) {
          array.splice(i, 1);
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
    // check current round
    // if clicked go to next round
    if (this.state.currentRound === 'roundOne') {

      this.setState({
        round: this.state.roundTwo,
        currentRound: 'roundTwo',
        showPreviousButton: true,
      })
    } else if (this.state.currentRound === 'roundTwo') {

      this.setState({
        round: this.state.roundThree,
        currentRound: 'roundThree',
        showNextButton: false,
        showSubmitButton: true
      })
    }

    const inputs = document.querySelectorAll('input')

    inputs.forEach(input => {
      input.checked = false;
    })

  }

  goToPreviousSet = () => {
    if (this.state.currentRound === 'roundTwo') {

      this.setState({
        round: this.state.roundOne,
        currentRound: 'roundOne',
        showPreviousButton: false,


      })
    } else if (this.state.currentRound === 'roundThree') {

      this.setState({
        round: this.state.roundTwo,
        currentRound: 'roundTwo',
        showNextButton: true,
        showSubmitButton: false,
        showRetry: false
      })
    }
  }

  showInfoBar = () => {
    this.setState({
      showInfo: true
    })
  }

  hideInfoBar = () => {
    this.setState({
      showInfo: false
    })
  }

  handleSubmit = () => {

    const scoreArray = [];
    const compare = (array1, array2) => {
      array1.forEach((element1) => array2.forEach((element2) => {
        if (element1 === element2) {
          scoreArray.push(element1)
        }
      }))
    }

    compare(this.state.usersGarbageBin, this.state.garbageItems)
    compare(this.state.organicItems, this.state.usersOrganicBin)
    compare(this.state.usersRecyclingBin, this.state.recyclingItems)

    const score = scoreArray.length
    this.setState({
      score: score,
      showSubmitButton: false,
      showRetry: true
    })
  }

  refreshPage = () => {
    window.location.reload();
  }

  render() {
    return (
      <div className="App" >
        <header>
          <h1>Waste-Wise!</h1>

          <button className="information-btn" onClick={this.showInfoBar}><i className="fas fa-info-circle"></i></button>

          {this.state.showInfo ?
            <div className="info">
              <button onClick={this.hideInfoBar}><i className="fas fa-times"></i></button>
              <h2>How to Play?</h2>
              <ol className="info-container">
                <li>First, take a look at the Wastenot Farms brochure!</li>
                <li>Then, go through the quiz and place the items in whichever bin you think they belong! But remember, Wastenot Farms' green bins can accept items that you might not expect!</li>
                <li>Select the green circle for Wastenot organic waste, blue circle for recycling, and black circle for everything else.</li>
                <li>Then hit submit, scroll down to the bins and find out how much waste wisdom you posess!</li>
              </ol>
              <h3>What is Wastenot Farms?</h3>
              <div className="info-container">
                <p><a target="_blank" href="http://wastenotfarms.com/">Wastenot Farms</a> is a Toronto based earthworm hatchery that offers <a target="_blank" href="http://wastenotwormfarms.com/workplacefoodwasterecycling/">Green Bins Growing</a> food waste pickup and delivery service.</p>
              </div>
            </div> : null}

        </header>

        <div className="game-field">
          <ul className="trash-card-container">
            {this.state.round.map((trashItem, index) => {
              return (
                <form className="trash-card-and-inputs">

                  <Radio
                    value="usersOrganicBin"
                    name={index}
                    dataName={trashItem}
                    onChange={this.handleChange}
                    id="1"
                    typeOfBin=" in organic"
                    action="place "
                  />
                  <Radio
                    value="usersRecyclingBin"
                    name={index}
                    dataName={trashItem}
                    onChange={this.handleChange}
                    id="2"
                    typeOfBin=" in recycling"
                    action="place "
                  />

                  <Radio
                    value="usersGarbageBin"
                    name={index}
                    dataName={trashItem}
                    onChange={this.handleChange}
                    id="3"
                    typeOfBin=" in garbage"
                    action="place "
                  />
                  <li className="trash-card" key={index}>
                    <p>{trashItem}</p>
                  </li>
                </form>
              )
            })}
          </ul>
          <div className="proceed-buttons clearfix">

            {this.state.showPreviousButton ? <BackButton onClick={this.goToPreviousSet} /> : null}

            {this.state.showSubmitButton ? <SubmitButton onClick={this.handleSubmit} /> : null}

            {this.state.showNextButton ? <NextButton onClick={this.goToNextSet} /> : null}

            {this.state.showRetry ? <RetryButton onClick={this.refreshPage} /> : null}
          </div>
        </div>
        <div className="trash-bins">
          <div className="score"><p>Score:</p><p>{this.state.score}</p></div>
          <div className="organic bin">
            <i className="fas fa-seedling"></i>
            {this.state.usersOrganicBin.map((trashItem) => {
              return (
                <ul className="trash-item-list">
                  <li>{trashItem}</li>
                </ul>
              )
            })}
          </div>
          <div className="recycling bin">
            <i className="fas fa-recycle"></i>
            {this.state.usersRecyclingBin.map((trashItem) => {
              return (
                <ul className="trash-item-list">
                  <li>{trashItem}</li>
                </ul>
              )
            })}
          </div>
          <div className="garbage bin">
            <i className="far fa-trash-alt"></i>
            {this.state.usersGarbageBin.map((trashItem) => {
              return (
                <ul className="trash-item-list">
                  <li>{trashItem}</li>
                </ul>
              )
            })}
          </div>
        </div>
        <footer><p>Made by <a target="_blank" href="http://katbosnic.com"> Kat Bosnic</a></p></footer>
      </div >
    );
  }
}

export default App;
