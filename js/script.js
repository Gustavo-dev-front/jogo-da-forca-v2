const MAX_ATTEMPTS = 6;
const KEYBOARD_BOX = document.querySelector(".keyboard");
const OUTPUT_GUESSES = document.querySelector(".output .guesses");
const UNDERSCORE_BOX = document.querySelector(".output .word-list");
const HANGMAN = document.querySelector(".hangman-box img");
const MODAL = document.querySelector(".modal");
const BTN_PLAY_AGAIN = document.querySelector(".modal button");
let currentWord;
let wrongGuesses = 0;
let correctGuesses = 0;

async function getData() {
  const HINT_OUTPUT = document.querySelector(".output .hint");
  try {
    const request = await fetch("././data/data.json");
    const response = await request.json();
    const randomIndex = Math.round(Math.random() * response.length);
    const { hint, word } = response[randomIndex];
    currentWord = word;

    [...word].forEach(
      (letter) => (UNDERSCORE_BOX.innerHTML += `<li class="letter"></li>`)
    );

    HINT_OUTPUT.innerText = hint;
  } catch (error) {
    console.log(error);
  }
}

function createKeyboard() {
  let button;
  for (let index = 97; index <= 122; index++) {
    button = document.createElement("button");
    button.innerText = String.fromCharCode(index);
    KEYBOARD_BOX.appendChild(button);
  }
}

function resetGame() {
  MODAL.classList.remove("show");
  KEYBOARD_BOX.innerHTML = "";
  UNDERSCORE_BOX.innerHTML = "";
  wrongGuesses = 0;
  correctGuesses = 0;
  HANGMAN.src = `././images/hangman-${wrongGuesses}.svg`;
  OUTPUT_GUESSES.innerText = `${wrongGuesses} / ${MAX_ATTEMPTS}`;
  getData();
  createKeyboard();
}

function endGame(status) {
  MODAL.classList.add("show");
  const IMG = MODAL.querySelector("img");
  const H2 = MODAL.querySelector("h2");
  const P = MODAL.querySelector("p");
  const SPAN = P.querySelector("span");

  if (status === "victory") {
    IMG.src = "././images/victory.gif";
    H2.innerText = "Parabéns!";
    P.innerText = "Você acertou a palavra: ";
  } else {
    IMG.src = "././images/lost.gif";
    H2.innerText = "Game Over!";
    P.innerText = "A palavra correta é: ";
  }

  SPAN.innerText = currentWord;
  P.appendChild(SPAN);
}

function handleKeyboard(e) {
  const element = e.target;
  if ((element.tagName = "BUTTON")) {
    let hasLetter = currentWord.toUpperCase().includes(element.innerText);

    if (hasLetter) {
      const UNDERSCORE_LIST = document.querySelectorAll(".word-list .letter");
      [...currentWord].forEach((letter, index) => {
        if (element.innerText === letter.toUpperCase()) {
          UNDERSCORE_LIST[index].innerText = element.innerText;
          UNDERSCORE_LIST[index].classList.add("guessed");
          correctGuesses++;
        }
      });
    } else {
      wrongGuesses++;
      OUTPUT_GUESSES.innerText = `${wrongGuesses} / ${MAX_ATTEMPTS}`;
      HANGMAN.src = `././images/hangman-${wrongGuesses}.svg`;
    }

    element.disabled = true;
    if (correctGuesses === currentWord.length) endGame("victory");
    if (wrongGuesses === MAX_ATTEMPTS) endGame("defeat");
  }
}

getData();
createKeyboard();
KEYBOARD_BOX.addEventListener("click", handleKeyboard);
BTN_PLAY_AGAIN.addEventListener("click", resetGame);
