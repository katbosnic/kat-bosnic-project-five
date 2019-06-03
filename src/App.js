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
    // set states
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
      score: 0,
      wrongItems: [],
      showWrongItems: false,
      showWasteNotList: false
    }
  }

  // connect to firebase data
  componentDidMount() {
    const dbRef = firebase.database().ref();
    dbRef.on('value', (response) => {
      const trashObj = (response.val());
      // set trash items using firebase arrays
      this.setState({
        trashItems: trashObj.trashItemsArr,
        garbageItems: trashObj.garbageBinArr,
        recyclingItems: trashObj.recyclingBinArr,
        organicItems: trashObj.wasteWiseBinArr
      });

      // set which items go in which rounds 
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
    // grab trash item name and the bins they go in
    const targetedItemVal = event.target.value
    const targetedItem = event.target.dataset.name

    // create copies of the users trash bins
    const copyGarbageBin = [...this.state.usersGarbageBin]
    const copyRecyclingBin = [...this.state.usersRecyclingBin]
    const copyOrganicBin = [...this.state.usersOrganicBin]

    // set the state
    this.setState({
      usersGarbageBin: copyGarbageBin,
      usersOrganicBin: copyOrganicBin,
      usersRecyclingBin: copyRecyclingBin,
    })

    // DON'T WANT DUPLICATES OF ITEMS IN BINS 
    // an item can only exist once in one of the bins

    // check to see if the selected trash item is in any of the bins 
    // if it does exist in any of the bins
    // remove trash item from the bin
    const checkArray = (array) => {
      for (let i = 0; i < array.length; i++) {
        if (array[i] === targetedItem) {
          array.splice(i, 1);
        }
      }
    }

    // run the check on the copy
    checkArray(copyGarbageBin);
    checkArray(copyOrganicBin);
    checkArray(copyRecyclingBin);

    // set the state
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

    // clear all inputs when user goes to next round
    const inputs = document.querySelectorAll('input')

    inputs.forEach(input => {
      input.checked = false;
    })

  }

  goToPreviousSet = () => {
    // go to previous rounds on click of Back button
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

  // show the info bar 
  showInfoBar = () => {
    this.setState({
      showInfo: true
    })
  }

  // hide the info bar
  hideInfoBar = () => {
    this.setState({
      showInfo: false,
      showBrochure: false
    })
  }

  // show brochure
  showBrochure = () => {
    this.setState({
      showBrochure: true,
      showInfo: false
    })
  }

  // hide the brochure
  hideBrochure = () => {
    this.setState({
      showBrochure: false,
      showInfo: true
    })
  }

  // handle the submit
  handleSubmit = () => {
    // to get the score check to see if an element in the users bin matches an item in the actual bins and if it does push it to the score array -- then you will just have to get the length and append that to the page
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

    // to find which items were placed in the wrong bin, filter out all the user items that are also found in the actual bin list 
    const incorrect = [];
    const compareCorr = (array1, array2) => {
      const array3 = array1.filter(function (obj) { return array2.indexOf(obj) == -1; });
      incorrect.push(array3)
    }

    compareCorr(this.state.garbageItems, this.state.usersGarbageBin)
    compareCorr(this.state.recyclingItems, this.state.usersRecyclingBin)
    compareCorr(this.state.organicItems, this.state.usersOrganicBin)

    // concatenate the arrays to create one long list of wrong answers 
    const wrongAnswers = incorrect[0].concat(incorrect[1], incorrect[2])
    // set the state
    // and on submit show the user their wrong items
    this.setState({
      wrongItems: wrongAnswers,
      showWrongItems: true
    })

    // get the length of the score array to get a score
    // hide submit button and show retry button
    const score = scoreArray.length
    this.setState({
      score: score,
      showSubmitButton: false,
      showRetry: true
    })
  }

  // on click of refresh button, refresh the page
  refreshPage = () => {
    window.location.reload();
  }

  render() {
    return (
      <div className="App" >
        <header>
          <h1>Waste-Wise!</h1>

          {/* on click change the state of showInfo to true */}
          <button className="information-btn" onClick={this.showInfoBar}><i className="fas fa-info-circle"></i></button>

          {/* show info if showInfo is true */}
          {this.state.showInfo ?
            <div className="info">
              <button onClick={this.hideInfoBar}><i className="fas fa-times"></i></button>
              <h2>How to Play?</h2>
              <ol className="info-container">
                <li>First, take a look at the <a href="#" onClick={this.showBrochure}>Wastenot Farms item list</a>!</li>
                <li>Then, go through the quiz and place the items in whichever bin you think they belong! But remember, Wastenot Farms' green bins can accept items that you might not expect!</li>
                <li>Select the green circle for Wastenot organic waste, blue circle for recycling, and black circle for everything else.</li>
                <li>Then hit submit, scroll down to the bins and find out how much waste wisdom you posess!</li>
              </ol>
              <h3>What is Wastenot Farms?</h3>
              <div className="info-container">
                <p><a target="_blank" href="http://wastenotfarms.com/">Wastenot Farms</a> is a Toronto based earthworm hatchery that offers <a target="_blank" href="http://wastenotwormfarms.com/workplacefoodwasterecycling/">Green Bins Growing</a> food waste pickup and delivery service.</p>
              </div>
            </div> : null}
          {this.state.showBrochure ?
            <div className="brochure info">
              <button onClick={this.hideBrochure}><i className="fas fa-times"></i></button>
              <h2>What can go in Wastenot green bins?</h2>
              <div className="info-container">
                <p>The general rule of thumb is "if it was a plant or animal at one time, it can go in the bin".</p>
                <p>Always check to see if packaging is labelled as compostable!</p>
                <p>Coffee cups can only go in the bin if they are labelled as compostable, otherwise they go in the garbage.</p>
                <p>Any food waste can go in the bin, including meat, citrus, coffee grinds, and tea bags.</p>
                <p>Even paper can go in the bin as along as it is not coloured, glossy, or waxed.</p>
              </div>
            </div> : null}
        </header>
        <div className="wrapper">
          <div className="game-field">
            <ul className="trash-card-container">
              {/* map through the current round */}
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
              {/* if showPreviousButton is set to true show BackButton else null */}
              {this.state.showPreviousButton ? <BackButton onClick={this.goToPreviousSet} /> : null}
              {/* same as above but with submitButton */}
              {this.state.showSubmitButton ? <SubmitButton onClick={this.handleSubmit} /> : null}
              {/* same as above but with NextButton */}
              {this.state.showNextButton ? <NextButton onClick={this.goToNextSet} /> : null}
              {/* same as above but with showRetry */}
              {this.state.showRetry ? <RetryButton onClick={this.refreshPage} /> : null}
            </div>
          </div>
        </div>

        {/* below append the users choices in the bins */}
        <div className="trash-bins">
          <div className="score"><p>Score:</p><p>{this.state.score}/18</p></div>
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
                  <li> {trashItem}</li>
                </ul>
              )
            })}
          </div>
          {/* only append the incorrect choices once the user has submited */}
          <div className="incorrect bin">
            <i class="far fa-times-circle"></i>
            {this.state.wrongItems.map((wrongItem) => {
              return (
                <ul className="trash-item-list">
                  <li>{wrongItem}</li>
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
