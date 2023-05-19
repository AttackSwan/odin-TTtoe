const glitchButtons = document.querySelectorAll(".glitch-button");

let stageOfPlay = "choosePlayer"; // entry into game
let audioOn = true;

// (function addButtonListeners() {
// 	glitchButtons.forEach((button) => {
// 		button.addEventListener("mouseenter", changeImage);
// 		button.addEventListener("click", selectCharacter);
// 	});
// })();

function gameBoard() {
	const board = [];
	const cells = 9;

	//Add cells to board grid
	for (let i = 0; i < cells; i++) {
		board[i] = [];
		board[i].push(Cell());
	}

	const getBoard = () => board;

	const setToken = (cell, token) => {
		//check if cell is empty, if so, drop token.
		console.log(cell, token, board[cell]);

		// if (board[cell].getValue() === 0) {
		// 	board[cell].addToken(token);
		// }
	};

	const resetBoard = () => {
		for (let i = 0; i < cells; i++) {
			board[i].reset();
		}
	};

	return { getBoard, setToken, resetBoard };
}

function Cell() {
	// Cell values:
	// 0 = empty
	// 1 = player
	// 2 = ai
	let value = 0;

	const getValue = () => value;

	const addToken = (token) => {
		value = token;
	};

	const reset = () => {
		value = 0;
	};

	return { getValue, addToken, reset };
}

const newCharacter = (name, type) => {
	// Ensure player image is in the format "Hero_Name.jpg"
	const img =
		type === "player" ? `/img/Hero_${name}.jpg` : `/img/AI_${name}.jpg`;
	const token = type === "player" ? "X" : "O";

	return { name, token, img };
};

function GameController() {
	const playerCharacters = [];
	const aiCharacters = [];
	const playerNames = ["Byte", "Titan", "Claw", "Ace"];
	const aiNames = ["Nexus", "Cipher", "Omega"];
	const players = ["Player", "AI"];

	const board = gameBoard();

	let difficulty = 0;
	let playerWins = 0;
	let aiWins = 0;

	playerNames.forEach((name) =>
		playerCharacters.push(newCharacter(name, "player"))
	);
	aiNames.forEach((name) => aiCharacters.push(newCharacter(name, "ai")));

	let activePlayer = playerCharacters[0];

	const getActivePlayer = () => activePlayer;

	const switchActivePlayer = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const setDifficulty = (level) => {
		difficulty = level;
	};

	const getBoard = () => board.getBoard();

	const displayBoard = () => {
		console.log("Display");
	};

	const playRound = (cell) => {
		//check if cell is empty and if so
		board.setToken(cell, getActivePlayer().token);
		// switchActivePlayer();
		displayBoard();
	};

	return { playRound, getActivePlayer, getBoard };
}

function ScreenController() {
	const game = GameController();
	const boardDiv = document.querySelector(".grid");

	const updateScreen = () => {
		const board = game.getBoard();
		boardDiv.textContent = "";
		//create board grid
		board.forEach((cell, index) => {
			const cellButton = document.createElement("button");
			cellButton.classList.add("play-cell");
			cellButton.dataset.cell = index;
			boardDiv.appendChild(cellButton);
		});
	};

	//add cell listeners
	function cellClickHandler(e) {
		const selectedCell = e.target.dataset.cell;
		//Check cell was clicked
		if (!selectedCell) return;

		game.playRound(selectedCell);
		updateScreen();
	}

	boardDiv.addEventListener("click", cellClickHandler);

	updateScreen();
}

// (function addCharacters() {
// 	const playerNames = ["Byte", "Titan", "Claw", "Ace"];
// 	const aiNames = ["Nexus", "Cipher", "Omega"];

// 	playerNames.forEach((name) =>
// 		playerCharacters.push(newCharacter(name, "player"))
// 	);
// 	aiNames.forEach((name) => aiCharacters.push(newCharacter(name, "ai")));
// })();

// function selectCharacter() {
// 	const playersDiv = document.querySelector(".players");
// 	const aiDiv = document.querySelector(".ai");
// 	const gameBoard = document.querySelector(".board");
// 	const audioAI = new Audio("/sound/enemy.mp3");
// 	const audioR1 = new Audio("/sound/round1.mp3");

// 	//play a selection sound and hide buttons on choice
// 	if (stageOfPlay === "choosePlayer") {
// 		stageOfPlay = "chooseAI";
// 		playersDiv.style.display = "none";
// 		audioOn ? audioAI.play() : null;
// 		setTimeout(() => {
// 			aiDiv.style.display = "flex";
// 		}, 1000);
// 	} else if (stageOfPlay === "chooseAI") {
// 		stageOfPlay = "round";
// 		aiDiv.style.display = "none";
// 		setTimeout(() => {
// 			playRound();
// 		}, 2000);
// 		audioOn ? audioR1.play() : null;
// 	}
// }

// function changeImage(e) {
// 	const audioBeep = new Audio("/sound/beep.mp3");
// 	const characterName = e.target
// 		.closest(".button-container")
// 		.getAttribute("id");
// 	let characterType;
// 	let imageDiv;
// 	let nameSpan;

// 	audioOn ? audioBeep.play() : null;

// 	//Check if character is player or ai and
// 	playerCharacters.forEach((character) => {
// 		if (character.name === characterName) {
// 			characterType = "player";
// 		}
// 	});
// 	if (!characterType) {
// 		characterType = "ai";
// 	}

// 	updateImage(characterName, characterType);
// }

// function updateImage(name, type) {
// 	const screen = type === "player" ? "hero" : "opponent";
// 	const imgPrefix = type === "player" ? "Hero_" : "AI_";
// 	const imageDiv = document.querySelector(`.screen.${screen} .screen-image`);
// 	const nameSpan = document.querySelector(`.screen.${screen} .name`);

// 	imageDiv.style.backgroundImage = `url(/img/${imgPrefix}${name}.jpg)`;
// 	updateScreenText(name, nameSpan);
// }

// function updateScreenText(name, nameSpan) {
// 	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// 	let interval = null;
// 	let iteration = 0;
// 	clearInterval(interval);
// 	interval = setInterval(() => {
// 		nameSpan.innerText = nameSpan.dataset.value
// 			.split("")
// 			.map((letter, index) => {
// 				if (index < iteration) {
// 					return name[index];
// 				}
// 				return letters[Math.floor(Math.random() * 26)];
// 			})
// 			.join("");
// 		if (iteration >= nameSpan.dataset.value.length) {
// 			clearInterval(interval);
// 		}
// 		iteration += 1 / 3;
// 	}, 30);
// }

ScreenController();
