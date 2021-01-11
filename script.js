/***************************
 * links
 * {@link} -  https://www.w3schools.com/howto/howto_css_hide_scrollbars.asp
 * {@link} - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * {@link} - https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * {@link} - https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll
 * {@link} - https://www.w3schools.com/js/js_timing.asp
 * {@link} - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
 * 
 ***************************/


// pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');

// splash page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');

// countdown page
const countdown = document.querySelector('.countdown');

// game page
const itemContainer = document.querySelector('.item-container');
// score page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// game page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

// scroll
let valueY = 0;

//refresh splash page best scores
function bestScoresToDOM() {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;
  });
}

//check local storage for best scores, set bestScoreArray
function getSavedBestScores() {
  if (localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}

//update best score array
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    //select correct best score to update
    if (questionAmount == score.questions) {
      //return best score as number with one decimal   
      const savedBestScore = Number(bestScoreArray[index].bestScore);

      //update if the new final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  //update splash page
  bestScoresToDOM();
  //save to local storage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

// reset game
function playAgain() {
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playeGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

//show score page
function showScorePage() {
  //show play again button after 1 second
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}


//format & display time to dom
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();

  // scroll to Top, go to Score Page
  itemContainer.scrollTo({ top: 0, behavior: 'instant' });
  showScorePage();

}

//stop timer process results go to score page
function checkTime() {

  //console.log('timePlayed:', timePlayed);

  if (playerGuessArray.length == questionAmount) {
    //console.log('player quess array:', playeGuessArray);

    clearInterval(timer);

    //check for wrong guesses add penalty time
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        //correct quess, no penalty
      } else {
        //incorrect guess, add penalty
        penaltyTime += 0.5;
      }
    });

    finalTime = timePlayed + penaltyTime;
    //console.log('time: ', timePlayed, ' penalty : ', penaltyTime, ' final: ', finalTime);
    scoresToDOM();
  }
}


//add a tenth of a second to timpePlayed
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

//start time when game page is clicked
function startTimer() {
  //reset times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;

  timer = setInterval(addTime, 1000);
  //  
  gamePage.removeEventListener('click', startTimer);
}

//scroll and score user selection in playerGuessArray
function select(guessedTrue) {
  //console.log('player quess array:', playeGuessArray);
  //scroll 80 pixels
  valueY += 80;
  itemContainer.scroll(0, valueY);

  //add player guess to array 
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');

}

//displays game page 
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

//get random number up to a max number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// create correct / incorrect random equations
function createEquations() {

  // randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  //console.log('correct equations: ', correctEquations);

  // set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  //console.log('wrong equations: ', wrongEquations);


  //loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }

  // loop through, mess with the equation results, push to array

  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(2);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  //console.log('equations array', equationsArray);
  shuffle(equationsArray);
}

//add equations to dom
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    //item
    const item = document.createElement('div');
    item.classList.add('item');
    //equation text
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    //append
    item.appendChild(equationText);
    itemContainer.appendChild(item);

  });
}


//dynamically adding correct /incorrect equations
function populateGamePage() {
  // reset dom, set blank space above
  itemContainer.textContent = '';
  // spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // selected item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // append
  itemContainer.append(topSpacer, selectedItem);

  // create equations, build Elements in dom
  createEquations();
  equationsToDOM();

  // set blank space below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

//displays 3, 2, 1 go!
function countdownStart() {
  let count = 3;
  countdown.textContent = count;
  const timeCountDown = setInterval(() => {
    count--;
    if (count === 0) {
      countdown.textContent = 'go!';
    } else if (count === -1) {
      showGamePage();
      clearInterval(timeCountDown);
    } else {
      countdown.textContent = count;
    }
  }, 1000);
}

//navigate from splash page to countdown page
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  populateGamePage();
  countdownStart();
}

//get the value from selected radio button
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

//form that decides amount of questions
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  //console.log('question amount', questionAmount);

  //pass the value if have some value
  if (questionAmount) {
    showCountdown();
  }

}

startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    //remove selected label styling
    radioEl.classList.remove('selected-label');
    //add it back if radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
  });
});

//event listeners
gamePage.addEventListener('click', startTimer);
startForm.addEventListener('submit', selectQuestionAmount);

//on load
getSavedBestScores();