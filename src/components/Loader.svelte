<script lang="ts">
	let suits = ['♠', '♥', '♦', '♣'];

	interface Card {
		suit: string;
	}

	let previousSuit: string | null = null;

	function getRandomCard(): Card {
		let suit: string;
		do {
			suit = suits[Math.floor(Math.random() * suits.length)];
		} while (suit === previousSuit);
		previousSuit = suit;
		return { suit };
	}

	let frontCard: Card = getRandomCard();
	let backCard: Card = getRandomCard();

	function shuffleCard() {
		setInterval(() => {
			backCard = getRandomCard();
			setTimeout(() => {
				frontCard = getRandomCard();
			}, 1000);
		}, 2000);
	}

	shuffleCard();
</script>

<div class="loader">
	<div class="card-container">
		<div class="card">
			<div class="card-face front">
				<span class="suit">{frontCard.suit}</span>
			</div>
			<div class="card-face back">
				<span class="suit">{backCard.suit}</span>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.loader {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: rgba(0, 0, 0, 0.5);
		height: 100%;
		width: 100%;
		z-index: 4;
	}

	.card-container {
		perspective: 1000px;
	}

	.card {
		width: 4rem;
		height: 6rem;
		position: relative;
		transform-style: preserve-3d;
		animation: flip 2s infinite;
	}

	.card-face {
		width: 100%;
		height: 100%;
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: white;
		color: black;
		border-radius: 0.3rem;
		border: 1px solid black;
		backface-visibility: hidden;
	}

	.front {
		transform: rotateY(0deg);
	}

	.back {
		transform: rotateY(180deg);
	}

	.suit {
		font-size: 1.5rem;
	}

	@keyframes flip {
		0% {
			transform: rotateY(0deg);
		}
		50% {
			transform: rotateY(180deg);
		}
		100% {
			transform: rotateY(360deg);
		}
	}
</style>
