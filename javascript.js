let audioOn = true;

function Cell() {
	// Cell values:
	// "" = empty
	// 1 = player
	// 2 = ai
	let value = "";

	const getValue = () => value;

	const addToken = (token) => {
		value = token;
	};

	const reset = () => {
		value = 0;
	};

	return { getValue, addToken, reset };
}

function gameBoard() {
	const board = [];
	const cells = 9;

	//Add cells to board grid
	for (let i = 0; i < cells; i++) {
		board[i] = Cell();
	}

	const getBoard = () => board;

	const setToken = (cell, token) => {
		let changed = false;
		if (board[cell].getValue() === "") {
			board[cell].addToken(token);
			changed = true;
		}
		return changed;
	};

	return { getBoard, setToken };
}

const newCharacter = (name, type) => {
	// Ensure player image is in the format "Hero_Name.jpg"
	const img =
		type === "player" ? `/img/Hero_${name}.jpg` : `/img/AI_${name}.jpg`;
	const token = type === "player" ? "X" : "O";

	return { name, token, img };
};

function GameController() {
	const board = gameBoard();

	let difficulty = 0;
	let playerWins = 0;
	let aiWins = 0;

	const players = game.getPlayers;

	let activePlayer = players[0];

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
		// Check if tageted cell changes and update game if it does
		const cellChanged = board.setToken(cell, getActivePlayer().token);
		if (cellChanged) {
			// switchActivePlayer();
			displayBoard();
		}
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
			cellButton.textContent = cell.getValue();
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

const getCharacterChoices = () => {
	const heros = ["Byte", "Titan", "Claw", "Ace"];
	const ai = ["Nexus", "Cipher", "Omega"];
	const players = [];

	const glitchButtons = document.querySelectorAll(".glitch-button");

	let stageOfPlay = "choosePlayer"; // entry into game

	const getPlayers = () => players;

	function addButtonListeners() {
		glitchButtons.forEach((button) => {
			button.addEventListener("mouseenter", changeImage);
			button.addEventListener("click", selectCharacter);
		});
	}

	function changeImage(e) {
		const audioBeep = new Audio("/sound/beep.mp3");

		audioOn ? audioBeep.play() : null;

		// Get character name and type on button hover
		const name = characterName(e);
		const type = characterType(name);

		updateImage(name, type);
	}

	const characterName = (e) => {
		const characterName = e.target
			.closest(".button-container")
			.getAttribute("id");

		return characterName;
	};

	const characterType = (characterName) => {
		let characterType;
		heros.forEach((hero) => {
			if (hero === characterName) {
				characterType = "player";
			}
		});
		if (!characterType) {
			characterType = "ai";
		}

		return characterType;
	};

	function updateImage(name, type) {
		//Select appropriate screen and image prefix to match DOM
		const screen = type === "player" ? "hero" : "opponent";
		const imgPrefix = type === "player" ? "Hero_" : "AI_";
		const imageDiv = document.querySelector(
			`.screen.${screen} .screen-image`
		);
		const nameSpan = document.querySelector(`.screen.${screen} .name`);
		imageDiv.style.backgroundImage = `url(/img/${imgPrefix}${name}.jpg)`;

		updateScreenText(name, nameSpan);
	}

	function updateScreenText(name, nameSpan) {
		//Make letters cycle randomly when hero image is changed
		//Return new hero name
		const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let interval = null;
		let iteration = 0;
		clearInterval(interval);
		interval = setInterval(() => {
			nameSpan.innerText = nameSpan.dataset.value
				.split("")
				.map((letter, index) => {
					if (index < iteration) {
						return name[index];
					}
					return letters[Math.floor(Math.random() * 26)];
				})
				.join("");
			if (iteration >= nameSpan.dataset.value.length) {
				clearInterval(interval);
			}
			iteration += 1 / 3;
		}, 30);
	}

	function selectCharacter(e) {
		const playersDiv = document.querySelector(".players");
		const aiDiv = document.querySelector(".ai");
		const gameBoard = document.querySelector(".board");
		const audioAI = new Audio("/sound/enemy.mp3");
		const audioR1 = new Audio("/sound/round1.mp3");

		const name = characterName(e);
		const type = characterType(name);

		const newPlayer = newCharacter(name, type);

		//play a selection sound and hide buttons on click
		if (stageOfPlay === "choosePlayer") {
			playersDiv.style.display = "none";
			audioOn ? audioAI.play() : null;
			stageOfPlay = "chooseAI";
			aiDiv.style.display = "flex";
			players.push(newCharacter);
		} else if (stageOfPlay === "chooseAI") {
			aiDiv.style.display = "none";
			audioOn ? audioR1.play() : null;
			stageOfPlay = "round";
			players.push(newCharacter);
		}
	}

	addButtonListeners();

	return { getPlayers };
};

const game = getCharacterChoices();
