let audioOn = true;

function Cell() {
	// Values:
	// "" = empty
	// 1 = player
	// 2 = ai
	const playerColor = "rgb(var(--hero-color))";
	const aiColor = "rgb(var(--ai-color))";
	let value = "";
	let color = "";

	const getValue = () => value;

	const addToken = (token) => {
		value = token;
		setColor(token);
	};

	const setColor = (token) => {
		color = token === "X" ? playerColor : aiColor;
	};

	const getColor = () => color;

	const reset = () => {
		value = "";
	};

	return { getValue, addToken, getColor, reset };
}

function gameBoard() {
	const board = [];
	const cells = 9;

	//Add cells to board grid
	for (let i = 0; i < cells; i++) {
		board[i] = Cell();
	}

	const getBoard = () => board;

	const checkCellBlank = (cell) => {
		return board[cell].getValue() === "" ? true : false;
	};

	const setToken = (cell, token) => {
		if (board[cell].getValue() === "") {
			board[cell].addToken(token);
		}
	};

	const reset = () => {
		for (let i = 0; i < cells; i++) {
			board[i].reset();
		}
	};

	return { getBoard, checkCellBlank, setToken, reset };
}

const newCharacter = (name, type) => {
	let wins = 0;

	// Ensure player image is in the format "Hero_Name.jpg"
	const img =
		type === "player" ? `/img/Hero_${name}.jpg` : `/img/AI_${name}.jpg`;
	const token = type === "player" ? "X" : "O";

	const getWins = () => wins;

	const increaseWins = () => wins++;

	return { name, img, token, type, getWins, increaseWins };
};

function GameController() {
	const board = gameBoard();

	// let difficulty = 0;
	let gameState = "playing";
	let turns = 0; //turns per round
	let rounds = 0;
	// let roundsToWin = 3;

	let players;

	let activePlayer;

	const winningCombinations = [
		//Vertical
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		//Horizontal
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		//Diagonal
		[0, 4, 8],
		[2, 4, 6],
	];

	const addPlayers = (array) => {
		players = array;
		activePlayer = players[0];
	};

	const getBoard = () => board.getBoard();

	const getActivePlayer = () => activePlayer;

	const switchActivePlayer = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const getGameState = () => gameState;

	const checkConditions = () => {
		const cells = document.querySelectorAll(".play-cell");

		winningCombinations.forEach((combo) => {
			let player = players[0];
			let ai = players[1];
			let winner = ai;

			// Check if winning cells all match and are not blank
			if (
				cells[combo[0]].textContent == cells[combo[1]].textContent &&
				cells[combo[1]].textContent == cells[combo[2]].textContent &&
				cells[combo[0]].textContent != ""
			) {
				//check if win uses player's token otherwise default to ai
				if (cells[combo[0]].textContent === player.token) {
					winner = player;
				}
				winRound(winner);
			} else if (turns === 9) {
				gameState = "draw";
				console.log("Draw!");
				// gameDraw();
			}
		});
	};

	const winRound = (winner) => {
		if (winner.getWins() < 2) {
			winner.increaseWins();
			gameState = "win";
			console.log(`${winner.name} wins!`);
			setTimeout(2000, newRound());
		} else if (winner.getWins() === 2) {
			winGame(winner);
		}
	};

	const newRound = () => {
		alert("Round" + rounds + "!");

		turns = 0;
		rounds++;
		gameState = "playing";
		board.reset();
	};

	const setDifficulty = (level) => {
		difficulty = level;
	};

	const playRound = (cell) => {
		turns++;
		let cellIsBlank = board.checkCellBlank(cell);
		let cellDiv = document.querySelector(
			`button.play-cell[data-cell="${cell}"]`
		);

		//check if move wins the round
		if (cellIsBlank && gameState === "playing") {
			board.setToken(cell, getActivePlayer().token);
			switchActivePlayer();
		}
	};

	return {
		playRound,
		checkConditions,
		getGameState,
		getActivePlayer,
		addPlayers,
		getBoard,
	};
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
			cellButton.style.color = cell.getColor();
			boardDiv.appendChild(cellButton);
		});

		//Check for draw or victory after cell update
		if (game.getGameState() === "playing") {
			game.checkConditions();
		}
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

	const start = (playersArray) => {
		game.addPlayers(playersArray);
		updateScreen();
	};

	return { start };
}

const Initialise = (() => {
	const UI = ScreenController();
	const heros = ["Byte", "Titan", "Claw", "Ace"];
	const ai = ["Nexus", "Cipher", "Omega"];
	const players = [];

	let stageOfPlay = "choosePlayer"; // entry into game

	function addListeners() {
		const glitchButtons = document.querySelectorAll(".glitch-button");
		const soundToggle = document.getElementById("sound-toggle");
		const musicToggle = document.getElementById("music-toggle");
		const acceptButton = document.getElementById("accept-button");

		glitchButtons.forEach((button) => {
			button.addEventListener("mouseenter", changeImage);
			button.addEventListener("click", selectCharacter);
		});

		soundToggle.addEventListener("change", function () {
			variable1 = toggle1.checked;
			// Perform any additional actions based on the updated state
		});

		musicToggle.addEventListener("change", function () {
			variable2 = toggle2.checked;
			// Perform any additional actions based on the updated state
		});

		acceptButton.addEventListener("click", loadUI);
	}

	function loadUI() {
		const audioHero = new Audio("/sound/hero.mp3");
		const optionsDiv = document.querySelector(".options");
		const hiddenGameElements = [
			document.querySelector(".screen.hero"),
			document.querySelector(".screen.opponent"),
			document.querySelector(".board"),
			document.querySelector(".players"),
		];

		audioOn ? audioHero.play() : null;

		optionsDiv.style.display = "none";
		hiddenGameElements.forEach((element) => {
			element.style.display = "flex";
		});
	}

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

	function characterName(e) {
		const characterName = e.target
			.closest(".button-container")
			.getAttribute("id");

		return characterName;
	}

	function characterType(characterName) {
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

	function changeImage(e) {
		const audioBeep = new Audio("/sound/beep.mp3");

		audioOn ? audioBeep.play() : null;

		// Get character name and type on button hover
		const name = characterName(e);
		const type = characterType(name);

		updateImage(name, type);
	}

	function selectCharacter(e) {
		const playersDiv = document.querySelector(".players");
		const aiDiv = document.querySelector(".ai");
		const gameBoard = document.querySelector(".board");
		const audioAI = new Audio("/sound/enemy.mp3");
		const audioR1 = new Audio("/sound/round1.mp3");

		let name = characterName(e);
		let type = characterType(name);

		let newPlayer = newCharacter(name, type);

		//play a selection sound and hide buttons on click
		if (stageOfPlay === "choosePlayer") {
			audioOn ? audioAI.play() : null;
			stageOfPlay = "chooseAI";

			playersDiv.style.display = "none";
			aiDiv.style.display = "flex";

			players.push(newPlayer);
		} else if (stageOfPlay === "chooseAI") {
			audioOn ? audioR1.play() : null;
			stageOfPlay = "round";

			aiDiv.style.display = "none";
			players.push(newPlayer);

			UI.start(players);
		}
	}
	addListeners();
})();
