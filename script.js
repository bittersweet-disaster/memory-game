function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startNewGame() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  cardsArray.forEach((card) => {
    card.classList.remove('opened', 'found');
    card.querySelector('.image-cover').classList.remove('fade-out');
  })

  moves.textContent = 0;
  pairs.textContent = 0;

  reset();
  changeImages();
}

function changeImages() {
  shuffleArray(allCards);
  cardsArray.forEach((card, index) => {
    card.querySelector('.card-image').src = allCards[index]['image'];
    card.querySelector('.card-image').dataset.pair = allCards[index]['number'];
  })
}

function checkForMatch() {
  const id1 = firstCard.querySelector('.card-image').dataset.pair;
  const id2 = secondCard.querySelector('.card-image').dataset.pair;
  moves.textContent++;
  if (id1 === id2) {
    // It's a match!
    firstCard.classList.replace('opened', 'found');
    secondCard.classList.replace('opened', 'found');
    pairs.textContent++;
    checkResult();
    reset();
  } else {
    // Not a match: Lock board immediately to prevent accidental multi-clicks
    isLocked = true;
    timeoutId = setTimeout(() => {
      firstCard.classList.remove('opened');
      secondCard.classList.remove('opened');
      firstCard.querySelector('.image-cover').classList.remove('fade-out');
      secondCard.querySelector('.image-cover').classList.remove('fade-out');
      reset();
    }, 1000);
  }
}

function checkResult() {
  if (pairs.textContent === '8') {
    resultMoves.textContent = 'Number of moves: ' + moves.textContent;
    openModal(modalWin);
  }
}

function createModal(className) {
  const dialog = document.createElement('dialog');
  dialog.className = className;
  section.append(dialog);
  const dialogContent = document.createElement('div');
  dialog.append(dialogContent);
}

function openModal(modal) {
  modal.showModal();
}

function closeModal(modal) {
  modal.close();
}

function reset() {
  firstCard = null;
  secondCard = null;
  isLocked = false;
  timeoutId = null;
}

const header = document.createElement('header');
document.body.append(header);

const main = document.createElement('main');
document.body.append(main);

const section = document.createElement('section');
main.append(section);

const newGameBtn = document.createElement('button');
header.append(newGameBtn);
newGameBtn.textContent = 'New Game';

const leaderboardBtn = document.createElement('button');
header.append(leaderboardBtn);
leaderboardBtn.textContent = 'Leaderboard';

const cardsWrapper = document.createElement('div');
cardsWrapper.className = 'cards-wrapper';
section.append(cardsWrapper);

const counters = document.createElement('div');
section.append(counters);
counters.classList.add('counters');

const moves = document.createElement('div');
counters.append(moves);
moves.textContent = 0;

const pairs = document.createElement('div');
counters.append(pairs);
pairs.textContent = 0;

createModal('win');
const modalWin = document.querySelector('.win');
const modalWinContent = modalWin.querySelector('div');
const result = document.createElement('p');
const resultMoves = document.createElement('p');
const modalNewGameBtn = newGameBtn.cloneNode(true);
const closeModalBtn = document.createElement('button');
modalWinContent.append(result);
modalWinContent.append(resultMoves);
modalWinContent.append(modalNewGameBtn);
modalWinContent.append(closeModalBtn);
result.textContent = 'That\'s a win!';
resultMoves.textContent = '';
closeModalBtn.textContent = 'Close result';

const cards = [{ number: 1, image: '1.jpg' }, { number: 2, image: '2.jpg' }, { number: 3, image: '3.jpg' }, { number: 4, image: '4.jpg' }, { number: 5, image: '5.jpg' }, { number: 6, image: '6.jpg' }, { number: 7, image: '7.jpg' }, { number: 8, image: '8.jpg' }];
const allCards = cards.concat(cards);

shuffleArray(allCards);

for (let i = 0; i < 16; i++) {
  let div = document.createElement('div');
  div.className = 'card';

  let imageCover = document.createElement('img');
  imageCover.src = 'pumpkin.jpg';
  imageCover.className = 'image image-cover';

  let image = document.createElement('img');
  image.dataset.pair = allCards[i]['number'];
  image.src = allCards[i]['image'];
  image.className = 'image card-image';

  div.append(imageCover);
  div.append(image);
  cardsWrapper.append(div);
}

let cardsArray = Array.from(document.querySelectorAll('.card'));

let firstCard = null;
let secondCard = null;
let isLocked = false;
let timeoutId = null;

cardsArray.forEach((card) => {
  card.addEventListener('click', () => {
    // Ignore clicks if board is locked, or card is already opened/found
    if (isLocked) return;
    if (card.classList.contains('opened') || card.classList.contains('found')) return;
    if (card === firstCard) return; // Guard against clicking the exact same card twice

    card.classList.add('opened');
    card.querySelector('.image-cover').classList.add('fade-out');

    if (!firstCard) {
      // First card selection
      firstCard = card;
    } else {
      isLocked = true;
      // Second card selection
      secondCard = card;
      checkForMatch();
    }
  })
})

newGameBtn.addEventListener('click', () => {
  startNewGame();
})

modalNewGameBtn.addEventListener('click', () => {
  startNewGame();
  closeModal(modalWin);
})

closeModalBtn.addEventListener('click', () => {
  closeModal(modalWin);
})