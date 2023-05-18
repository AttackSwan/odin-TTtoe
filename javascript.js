const playerCharacters = [];
const aiCharacters = [];
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const glitchButtons = document.querySelectorAll(".glitch-button");

let stageOfPlay = 0; // entry into game

function addButtonListeners() {
	glitchButtons.forEach((button) => {
		button.addEventListener("mouseenter", changeImage);
	});
}

function changeImage(e) {
	const characterName = e.target
		.closest(".button-container")
		.getAttribute("id");

	let characterType;
	let imageDiv;
	let nameSpan;

	//Check if character is player or ai
	playerCharacters.forEach((character) => {
		if (character.name === characterName) {
			characterType = "player";
		}
	});

	if (!characterType) {
		characterType = "ai";
	}
	updateImage(characterName, characterType);
}

function updateImage(name, type) {
	const screen = type === "player" ? "hero" : "opponent";
	const imgPrefix = type === "player" ? "Hero_" : "AI_";
	const imageDiv = document.querySelector(`.screen.${screen} .screen-image`);
	const nameSpan = document.querySelector(`.screen.${screen} .name`);

	imageDiv.style.backgroundImage = `url(/img/${imgPrefix}${name}.jpg)`;
	updateScreenText(name, nameSpan);
}

function updateScreenText(name, nameSpan) {
	console.log(name, nameSpan);
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

function addCharacters() {
	const playerNames = ["Byte", "Titan", "Claw", "Ace"];
	const aiNames = ["Nexus", "Cipher", "Omega"];

	playerNames.forEach((name) =>
		playerCharacters.push(newCharacter(name, "player"))
	);
	aiNames.forEach((name) => aiCharacters.push(newCharacter(name, "ai")));
}

const newCharacter = (name, type) => {
	// Ensure player image is in the format "Hero_Name.jpg"
	const img = `/img/Hero_${name}.jpg`;
	return { name, img };
};

addCharacters();

addButtonListeners();
