// CREDIT -- Text effect and Screen Overlay --
// Dev:     Hyperplexed
// Youtube: https://www.youtube.com/watch?v=jMVhxBB3l0w&ab_channel=Hyperplexed
// CodePen: https://codepen.io/Hyperplexed/pen/vYzgeYE
// Notes:   Modified to suit this project

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const screen = document.querySelector(".screen");
const nameSpan = document.querySelector(".name");

screen.onmouseenter = (e) => coolLetters(e);

function coolLetters() {
	let interval = null;
	let iteration = 0;

	clearInterval(interval);

	interval = setInterval(() => {
		nameSpan.innerText = nameSpan.innerText
			.split("")
			.map((letter, index) => {
				if (index < iteration) {
					return nameSpan.dataset.value[index];
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
