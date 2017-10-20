var lottery = (function(window){
	var intervalId,
		winnerBox,
		participantsDiv,
		participantsInput,
		lotteryDiv,
		winSound,
		goButton,
		randomIndex,
		canvas,
		ctx,
		confettiIntervalId;

	var participants = [];
	var elapsedTime = 0;
	var interval = 100;
	var W = window.innerWidth;
	var H = window.innerHeight;
	var mp = 100; //max particles
	var particles = [];
	var angle = 0;
	var radius = 6;

	function init()
	{
		winnerBox = document.getElementById('winner');
		goButton = document.getElementById('go');
		participantsDiv = document.getElementById('participantsDiv');
		participantsInput = document.getElementById('participantsInput');
		lotteryDiv = document.getElementById('lottery');
		canvas = document.getElementById("canvas");
		winSound = document.getElementById("winSound");
		ctx = canvas.getContext("2d");
		canvas.width = W;
		canvas.height = H;

		for(var i = 0; i < mp; i++)
		{
			particles.push({
				x: Math.random()*W, //x-coordinate
				y: Math.random()*H, //y-coordinate
				r: Math.random()*radius+1, //radius
				d: Math.random()*mp, //density
				color: "rgba(" + Math.floor((Math.random() * 255)) +", " + Math.floor((Math.random() * 255)) +", " + Math.floor((Math.random() * 255)) + ", 0.8)"
			})
		}
	}

	function drawWinner()
	{
		winnerBox.classList.remove('won');
		goButton.disabled = true;
		clearInterval(confettiIntervalId);
		ctx.clearRect(0, 0, W, H);

		if (participants.length == 0)
		{
			winnerBox.value = 'No Participants';
			return;
		}

		intervalId = setInterval(function()
		{
			randomIndex = Math.floor(Math.random() * ((participants.length - 1) + 1));
			winnerBox.value = participants[randomIndex];
			elapsedTime += interval;

			if (elapsedTime === 3000)
			{
				elapsedTime = 0;
				participants.splice(randomIndex, 1);
				clearInterval(intervalId);
				goButton.disabled = false;
				winnerBox.classList.add('won');
				confettiIntervalId = setInterval(drawConfetti, 33);
				winSound.play();
			}

		}, interval);
	}

	function drawConfetti()
	{
		ctx.clearRect(0, 0, W, H);

		for(var i = 0; i < mp; i++)
		{
			var p = particles[i];
			ctx.beginPath();
			ctx.fillStyle = p.color;
			ctx.moveTo(p.x, p.y);
			ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
			ctx.fill();
		}

		update();
	}

	function update()
	{
		angle += 0.01;
		for(var i = 0; i < mp; i++)
		{
			var p = particles[i];
			//Updating X and Y coordinates
			//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
			//Every particle has its own density which can be used to make the downward movement different for each flake
			//Lets make it more random by adding in the radius
			p.y += Math.cos(angle+p.d) + 1 + p.r/2;
			p.x += Math.sin(angle) * 2;

			//Sending flakes back from the top when it exits
			//Lets make it a bit more organic and let flakes enter from the left and right also.
			if(p.x > W+5 || p.x < -5 || p.y > H)
			{
				if(i%3 > 0) //66.67% of the flakes
				{
					particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d, color : p.color};
				}
				else
				{
					//If the flake is exitting from the right
					if(Math.sin(angle) > 0)
					{
						//Enter from the left
						particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d, color: p.color};
					}
					else
					{
						//Enter from the right
						particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d, color : p.color};
					}
				}
			}
		}
	}

	function participantsEntered()
	{
		// participants = ['Ahmed', 'Amr', 'Ben Ingram', 'Boris Bachovski', 'Calvin N', 'Carl Thomas', 'Damien', 'Davey', 'Faisal Akhter', 'George Tsaousidis', 'Giridhar Bg', 'Jaydeep Makwana', 'Jeremy K.', 'Jernej', 'Jerry', 'Jesse', 'Karel Schuller', 'Keith Franks', 'Kristian Vegerano', 'Litao Shen', 'Mahalakshmi Tinagarane', 'Manuel Echeverria', 'Mike', 'Nick Guia', 'Nick Rangas', 'Owais Siddiqi', 'Paul Eric Victoriano', 'Renuka.R', 'Rorie', 'Satya sahoo', 'Shermal', 'Syed Muhammad Ali', 'velgoti', 'vignesh arunachalam', 'Wilson Ryan', 'Jodie', 'Nick Likane', 'Sam', 'Bharath'];
		participants = participantsInput.value ? participantsInput.value.trim().split('\n').filter(function(n){ return (n != undefined && n != '') }) : [];
		participantsDiv.style.display = 'none';
		lotteryDiv.style.display = 'block';
	}

	var readyStateCheckInterval = setInterval(function()
	{
		if (document.readyState === 'complete' || document.readyState === 'loaded')
		{
			clearInterval(readyStateCheckInterval);
			init();
		}
	}, 10);

	return {
		drawWinner: drawWinner,
		participantsEntered: participantsEntered
	}
})(this);