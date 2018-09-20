"use strict";

function main() {
  // Instantiating instances of MVC components
  var model = new Model();
  var controller = new Controller(model);
  var view = new View(controller);
}

var numGuesses = 0;
var wordBank = [
  "mouse",
  "software",
  "computer",
  "python",
  "keyboard",
  "code",
  "client",
  "desktop",
  "display",
  "html"
];
var alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
];
var blanks = [];
var currentWord = wordBank[Math.floor(Math.random() * wordBank.length)];

function View(controller) {
  this.controller = controller;

  // DOM Manipulation is handled inside the View
  // The View is the only part which changes the DOM

  // LOAD THE ALPHABET KEYBOARD
  this.loadAlphabet = function() {
    for (var a = 0; a < alphabet.length; a++) {
      var letterButtons = document.createElement("button");
      letterButtons.setAttribute("id", alphabet[a]);
      letterButtons.addEventListener("click", controller);
      letterButtons.className = "letterButtons";
      letterButtons.innerHTML = alphabet[a];
      keyboardDisplay.appendChild(letterButtons);
      livesRemaining.innerHTML =
        "You have " + (7 - numGuesses) + " lives remaining";
    }
  };
  this.loadAlphabet();

  this.createBlanks = function() {
    blanks.push("_");
    return blanks.join(" ");
  };

  this.wordDisplay = document.getElementById("wordDisplay");
  for (var i = 0; i < currentWord.length; i++) {
    this.wordDisplay.innerHTML = this.createBlanks(blanks);
  }

  // The Controller will determine where the event is coming from,
  // and fire off the correct function based on the type of event
  this.restartButton = document.getElementById("restartButton");
  this.restartButton.addEventListener("click", controller);

  this.guessButton = document.getElementById("guessButton");
  this.guessButton.addEventListener("click", controller);

  this.guessWord = document.getElementById("guessWord");
  this.guessWord.addEventListener("keyup", controller);
}

function Model() {
  // The Model is for handling requests
  // If AJAX requests were necessary, they would go here
}

function Controller(model) {
  this.model = model;

  // The Controller is what 'mediates' between the View and Model
  // It is used for handling events and 'client-specific logic',
  // such as the controller methods below

  // EVENT HANDLING
  this.handleEvent = function(e) {
    e.stopPropagation();
    switch (e.type) {
      // These are the different types of events which may be called
      // This makes it easy to add event types in the future
      case "click":
        this.clickHandler(e.target);
        break;
      case "keyup":
        this.keyupHandler(e.keyCode);
        break;
      default:
        console.log(e.target);
    }
  };

  // CLICK EVENT HANDLER
  this.clickHandler = function(target) {
    // document.getElementById must be used here, to get a specific
    // letter, as they all share the same class and variable in the View
    var currentLetter = document.getElementById(target.id);

    switch (target) {
      // These are different elements which may be clicked
      case restartButton:
        this.restartGame();
        break;
      case guessButton:
        this.guessAnswer();
        break;
      case currentLetter:
        this.clickedLetter(currentLetter);
        break;
      default:
        console.log(target);
    }
  };

  // KEYUP EVENT HANDLER
  this.keyupHandler = function(e) {
    switch (e) {
      // keyCode 13 is the return key
      case 13:
        this.guessAnswer();
        break;
      default:
        console.log(e);
    }
  };

  // CONTROLLER METHODS

  // CLICKED LETTER
  this.clickedLetter = function(letter) {
    if (currentWord.indexOf(letter.innerHTML) > -1) {
      letter.style.backgroundColor = "#6ed651";
      var letterPosition = currentWord.indexOf(letter.innerHTML);

      // Replaces the blank with the letter you clicked
      blanks[letterPosition] = letter.innerHTML;
      wordDisplay.innerHTML = blanks.join(" ");

      // If all blanks are uncovered, you win
      if (wordDisplay.innerHTML === currentWord.split("").join(" ")) {
        livesRemaining.innerHTML = "You win!";
        restartButton.innerHTML = "Play again";
      }
    } else {
      letter.disabled = true;
      letter.style.backgroundColor = "#c43a17";
      numGuesses++;
      livesRemaining.innerHTML =
        "You have " + (7 - numGuesses) + " lives remaining";
      if (numGuesses > 7) {
        livesRemaining.innerHTML = "You ran out of lives!";
        alert("Game over");
        location.reload();
      }
    }
  };

  // RESTART
  this.restartGame = function() {
    location.reload();
  };

  // GUESS VIA TEXT INPUT
  this.guessAnswer = function() {
    numGuesses++;
    if (numGuesses > 7 || guessWord.value === currentWord) {
      wordDisplay.innerHTML = currentWord.split("").join(" ");
      livesRemaining.innerHTML = "You win!";
      restartButton.innerHTML = "Play again";
    }
  };
}

main();
