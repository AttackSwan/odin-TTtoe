function Cell() {
	// Values:
	// "" = empty
	// X = player
	// O = ai
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

	const getAvailable = () => {
		let emptyCells = [];
		for (i = 0; i < cells; i++) {
			if (board[i].getValue() === "") {
				emptyCells.push(i);
			}
		}
		return emptyCells;
	};

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

	return { getBoard, getAvailable, checkCellBlank, setToken, reset };
}

const newCharacter = (name, type, skill) => {
	let wins = 0;

	const token = type === "player" ? "X" : "O";

	const getName = () => name;
	const getToken = () => token;
	const getType = () => type;
	const getWins = () => wins;
	const setWins = (numWins) => {
		wins = numWins;
	};
	const increaseWins = () => wins++;
	const getSkill = () => skill;

	return {
		getName,
		getToken,
		getType,
		getSkill,
		getWins,
		setWins,
		increaseWins,
	};
};

function GameController() {
	const board = gameBoard();
	const winningCombinations = [
		//Horizontal
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		//Vertical
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		//Diagonal
		[0, 4, 8],
		[2, 4, 6],
	];

	let gameState = "playing";
	let turns = 0; // turns per round
	let rounds = 0;
	let roundsToWin = 3;

	let players;
	let activePlayer;

	const addPlayers = (array) => {
		players = array;
		activePlayer = players[0];
	};

	const getBoard = () => board.getBoard();

	const getActivePlayer = () => activePlayer;

	const switchActivePlayer = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
		activePlayer.getType() === "ai" ? aiPlayRound() : null;
	};

	const aiPlayRound = () => {
		let skill = activePlayer.getSkill();
		const skillActions = {
			1: NexusPlayRound,
			2: CipherPlayRound,
			3: OmegaPlayRound,
		};
		const aiPlays = skillActions[skill];
		aiPlays();
	};

	const NexusPlayRound = () => {
		//Randomly choose an empty cell
		const emptyCells = board.getAvailable();
		let randomCell =
			emptyCells[Math.floor(Math.random() * emptyCells.length)];
		playRound(randomCell);
	};

	const CipherPlayRound = () => {
		const boardContent = board.getBoard();
		let newBoard = [];

		//Find how many tokens played
		for (let i = 0; i < boardContent.length; i++) {
			newBoard[i] = boardContent[i].getValue();
		}

		const count = newBoard.filter((value) => value === "O").length;

		// Upgrade to heuristic evaluation if time permits
		// Alternate beween Nexus and Omega
		if (count % 2 > 0) {
			OmegaPlayRound();
		} else {
			NexusPlayRound();
		}
	};

	const OmegaPlayRound = () => {
		const ai = players[1];
		const aiToken = ai.getToken();
		let boardContents = board.getBoard();
		let newBoard = [];

		// Create a new board array of current board values
		for (let i = 0; i < board.getBoard().length; i++) {
			newBoard[i] = boardContents[i].getValue();
		}

		let bestMove = minmax(newBoard, ai).index;
		playRound(bestMove);
	};

	const getGameState = () => gameState;

	const checkIfWin = () => {
		let isWin = false;
		let currentBoard = board.getBoard();

		winningCombinations.forEach((combo) => {
			let cell0 = currentBoard[combo[0]].getValue();
			let cell1 = currentBoard[combo[1]].getValue();
			let cell2 = currentBoard[combo[2]].getValue();

			// Check if winning cells all match and are not blank
			if (cell0 == cell1 && cell1 == cell2 && cell0 != "") {
				// If no new board
				gameState = "win";
				isWin = true;
			}
		});
		return isWin;
	};

	const checkMinmaxWin = (newBoard, player) => {
		const playerToken = player.getToken();
		let winningToken = "";
		let isWin = false;

		winningCombinations.forEach((combo) => {
			let cell0 = newBoard[combo[0]];
			let cell1 = newBoard[combo[1]];
			let cell2 = newBoard[combo[2]];

			// Check if winning cells all match and are not blank
			if (cell0 === cell1 && cell1 === cell2 && cell0 !== "") {
				winningToken = cell0;
			}
		});

		if (winningToken === playerToken) {
			isWin = true;
		}

		return isWin;
	};

	const minmax = (newBoard, player) => {
		const hero = players[0];
		const ai = players[1];
		const availableSpots = newBoard.reduce((indices, value, index) => {
			if (value === "") {
				indices.push(index);
			}
			return indices;
		}, []);

		let moves = [];

		// Check for win/loss/draw
		if (checkMinmaxWin(newBoard, hero)) {
			return { score: -10 };
		} else if (checkMinmaxWin(newBoard, ai)) {
			return { score: 10 };
		} else if (availableSpots.length === 0) {
			return { score: 0 };
		}

		// Check all available moves for current board
		for (let i = 0; i < availableSpots.length; i++) {
			let move = {};
			move.index = availableSpots[i];

			// Set empty spot to active player
			newBoard[availableSpots[i]] = player.getToken();

			if (player.getType() === "ai") {
				const result = minmax(newBoard, hero);
				move.score = result.score;
			} else {
				const result = minmax(newBoard, ai);
				move.score = result.score;
			}

			//reset the spot to empty
			newBoard[availableSpots[i]] = "";

			// push the object to the array
			moves.push(move);
		}

		let bestMove;
		if (player.getType() === "ai") {
			let bestScore = -10000;
			for (let i = 0; i < moves.length; i++) {
				if (moves[i].score > bestScore) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		} else {
			// Else loop over the moves and choose the move with the lowest score
			let bestScore = 10000;
			for (let i = 0; i < moves.length; i++) {
				if (moves[i].score < bestScore) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		}

		return moves[bestMove];
	};

	const checkConditions = () => {
		if (checkIfWin()) {
			screenController.updateScreen();
			winRound(activePlayer);
		}

		if (turns === 9 && gameState === "playing") {
			gameState = "draw";
			drawRound();
		}

		if (gameState === "playing") {
			switchActivePlayer();
		}
	};

	const winRound = (winner) => {
		const winnerType = winner.getType();
		const heroName = players[0].getName();

		winner.increaseWins();

		let winText = winnerType === "player" ? "wins!" : "loses!";
		let roundText = `${heroName} ${winText}`;
		let statusText = getStatusText();

		if (winner.getWins() < roundsToWin) {
			gameState = "win";
			screenController.showOptions(true);
			screenController.nextRound(roundText, statusText);
		} else if (winner.getWins() === 3) {
			winGame(winner);
		}
	};

	const getStatusText = () => {
		let statusText = `${players[0].getWins()} : ${players[1].getWins()}`;
		return statusText;
	};

	const drawRound = () => {
		const drawText = "DRAW!";
		const statusText = getStatusText();
		screenController.showOptions(true);
		screenController.nextRound(drawText, statusText);
	};

	const winGame = () => {
		const newGameButton = document.getElementById("next-round");
		const hero = players[0];
		const ai = players[1];
		let winner = ai;
		let statusText = "That was just a warm up!";
		gameState = "gameOver";

		if (hero.getWins() === 3) {
			winner = hero;
			statusText = "CONGRATULATIONS!";
		}

		let winText = `${winner.getName()} wins the game!`;

		newGameButton.textContent = "PLAY AGAIN?";
		screenController.nextRound(winText, statusText);
		screenController.showOptions(true);
	};

	const newRound = () => {
		screenController.showOptions(false);

		if (gameState === "gameOver") {
			rounds = 0;
			players[0].setWins(0);
			players[1].setWins(0);
		}
		turns = 0;
		gameState = "playing";
		activePlayer = players[0]; //start with player

		rounds = gameState !== "draw" ? rounds++ : rounds; //don't increase on draw

		board.reset();
		screenController.updateScreen();
	};

	const playRound = (cell) => {
		turns++;
		let cellIsBlank = board.checkCellBlank(cell);
		let cellDiv = document.querySelector(
			`button.play-cell[data-cell="${cell}"]`
		);

		//check if move wins the round
		if (cellIsBlank && gameState === "playing") {
			board.setToken(cell, getActivePlayer().getToken());
			checkConditions();
		}
	};

	return {
		playRound,
		newRound,
		checkConditions,
		getGameState,
		getActivePlayer,
		addPlayers,
		getBoard,
	};
}

const UI = () => {
	// const UI = ScreenController();
	const game = GameController();
	const boardDiv = document.querySelector(".grid");
	const heros = ["Byte", "Titan", "Claw", "Ace"];
	const ai = ["Nexus", "Cipher", "Omega"];
	const players = [];

	let stageOfPlay = "choosePlayer"; // entry into options UI
	let soundOn = false;
	let musicOn = false;

	function addOptionsListeners() {
		const glitchButtons = document.querySelectorAll(".glitch-button");
		const soundToggle = document.getElementById("sound-toggle");
		const musicToggle = document.getElementById("music-toggle");
		const acceptButton = document.getElementById("accept-button");
		const roundButton = document.getElementById("next-round");

		glitchButtons.forEach((button) => {
			button.addEventListener("mouseenter", changeImage);
			button.addEventListener("click", selectCharacter);
		});

		soundToggle.addEventListener("change", function () {
			soundOn = soundToggle.checked;
		});

		musicToggle.addEventListener("change", function () {
			musicOn = musicToggle.checked;
		});

		acceptButton.addEventListener("click", loadUI);
		roundButton.addEventListener("click", game.newRound);
	}

	function cellClickHandler(e) {
		const selectedCell = e.target.dataset.cell;
		//Check cell was clicked
		if (!selectedCell) return;

		game.playRound(selectedCell);
		updateScreen();
	}

	function loadUI() {
		const audioHero = new Audio("/sound/hero.mp3");
		const audioMusic = new Audio("/sound/music.mp3");

		soundOn ? audioHero.play() : null;
		musicOn ? audioMusic.play() : null;

		const uiElements = {
			".screen.hero": "flex",
			".screen.opponent": "flex",
			".board": "flex",
			".players": "flex",
			".toggle": "none",
			"#accept-button": "none",
			"#next-round": "block",
			".options > h2": "block",
		};

		// Set display modes for above UI elements
		for (const selector in uiElements) {
			if (uiElements.hasOwnProperty(selector)) {
				const element = document.querySelector(selector);
				element.style.display = uiElements[selector];
			}
		}

		screenController.showOptions(false);
	}

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
	};

	function changeImage(e) {
		const audioBeep = new Audio("/sound/beep.mp3");
		soundOn ? audioBeep.play() : null;

		// Get character name and type on button hover
		const name = characterName(e);
		const type = characterType(name);

		updateImage(name, type);
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

		let name = characterName(e);
		let type = characterType(name);
		let skill = characterSkill(name);

		let newPlayer = newCharacter(name, type, skill);

		//play a selection sound and hide buttons on click
		if (stageOfPlay === "choosePlayer") {
			soundOn ? audioAI.play() : null;
			stageOfPlay = "chooseAI";

			playersDiv.style.display = "none";
			aiDiv.style.display = "flex";

			players.push(newPlayer);
		} else if (stageOfPlay === "chooseAI") {
			soundOn ? audioR1.play() : null;
			stageOfPlay = "round";

			aiDiv.style.display = "none";
			players.push(newPlayer);

			startGame();
		}
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

	function characterSkill(name) {
		const skills = {
			Nexus: 1,
			Cipher: 2,
			Omega: 3,
		};
		const skill = skills[name] || 0;
		return skill;
	}

	const startGame = () => {
		boardDiv.addEventListener("click", cellClickHandler);
		game.addPlayers(players);
		updateScreen();
	};

	const showOptions = (on) => {
		const roundForm = document.querySelector(".options");

		if (on) {
			roundForm.style.display = "grid";
		} else {
			roundForm.style.display = "none";
		}
	};

	const nextRound = (roundText, statusText) => {
		// Display if the player wins / loses and their current wins : losses
		const winText = document.querySelector(".options > h1");
		const totalsText = document.querySelector(".options > h2");

		winText.textContent = roundText;
		totalsText.textContent = statusText;
	};

	addOptionsListeners();

	return { updateScreen, showOptions, nextRound };
};

const screenController = UI();
