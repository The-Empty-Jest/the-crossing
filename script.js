function initialize(){
	//DRAG IMAGES
	traceImg = new Image();
	traceImg.src = "images/trace.png";
	processImg = new Image();
	processImg.src = "images/process.png";
	
	//ELEMENTS
	mainContainer = document.querySelector("main");
	ship = document.querySelector("#ship");
	preview = document.getElementById("preview");
	ship.side = "left";
	
	//BACKEND DATA
	USER = 0;
	PROCESS = 1;
	USER_STRING = "user";
	PROCESS_STRING = "process";
	leftCards = [3, 3];
	rightCards = [0, 0];
	shipCards = [0, 0];
	locations = [leftCards, rightCards, shipCards];
}

function dragToShip(event){
	if(event.target.matchSelector(".card-container > img")){
		card = event.target;
		fadeOut(card);
		source = event.target.parentElement.parentElement;
		
		if(card.src.includes("users")){
			event.dataTransfer.setDragImage(traceImg, 50, 50);
		}
		else{
			event.dataTransfer.setDragImage(processImg, 50, 50);
		}
	}
}

function dropOnShip(event){
	fadeIn(card);
	if(preview.childElementCount < 2 && card.parentElement.matchSelector("#" + ship.side + " .card-container")){
		preview.appendChild(card);
		transferCard(getLocation(source), 2, getType(card));
	}
}

function dragFromShip(event){
	if(preview.hasChildNodes()){
		card = event.target;
		fadeOut(card);
		source = event.target.parentElement.parentElement;
		if(card.src.includes("users")){
			event.dataTransfer.setDragImage(traceImg, 50, 50);
		}
		else{
			event.dataTransfer.setDragImage(processImg, 50, 50);
		}
	}
	else{
		event.preventDefault();
	}
}

function dropOnContainer(event){
	fadeIn(card);
	if(event.target.matchSelector("#" + ship.side + " .card-container")){
		if(card.parentElement.matchSelector("#preview")){
			event.target.appendChild(card);
			transferCard(2, getLocation(event.target.parentElement), getType(card));
		}
		else if(card.parentElement.parentElement.matchSelector("#" + ship.side)){
			event.target.appendChild(card);
			transferCard(getLocation(source), getLocation(card.parentElement.parentElement), getType(card));
		}
	}
	
	unglow();
}

function glow(){
	ship.querySelector("img").style.opacity = .2;
}

function unglow(){
	if(preview.childElementCount == 0){
		ship.querySelector("img").style.opacity = 1;
	}
}

function fadeOut(element){
	element.classList.remove("fade-in");
	element.classList.add("fade-out");
}

function fadeIn(element){
	element.classList.remove("fade-out");
	element.classList.add("fade-in")
}

function push(event){
	if(preview.hasChildNodes()){
		switch(ship.side){
			case "left":
				ship.side = "right";
				ship.className = "animate-right";
				break;
			case "right":
				ship.side = "left";
				ship.className = "animate-left";
				break;
		}
	}
	setTimeout(checkState, 1000);
}

function getType(element){
	if(element.src.includes(USER_STRING)){
		return USER;
	}
	else if(element.src.includes(PROCESS_STRING)){
		return PROCESS;
	}
}

function getLocation(element){
	if(element.matchSelector("#left")){
		return 0;
	}
	else if(element.matchSelector("#right")){
		return 1;
	}
	else if(element.matchSelector("#ship")){
		return 2;
	}
}

function transferCard(source, target, type){
	locations[source][type]--;
	locations[target][type]++;
}

function checkState(){
	if(rightCards[0] == 3 && rightCards[1] == 3){
		win();
	}
	else{
		var leftState = leftCards.slice(0);
		var rightState = rightCards.slice(0);
		if(ship.side == "left"){
			leftState[0] += shipCards[0];
			leftState[1] += shipCards[1];
		}
		else{
			rightState[0] += shipCards[0];
			rightState[1] += shipCards[1];
		}
		if(leftState[1] > leftState[0] && leftState[0] > 0){
			lose("left");
		}
		else if(rightState[1] > rightState[0] && rightState[0] > 0){
			lose("right");
		}
	}
}

function win(){
	alert("WON");
}

function lose(side){
	deadCards = document.querySelectorAll("#" + side + " img");
	for(var i = 0; i < deadCards.length; i++){
		if(deadCards[i].src.includes("user")){
			deadCards[i].classList.add("kill");
		}
	}
	switch (side){
		case "left":
			alert("LEFT");
			break;
		case "right":
			alert("RIGHT");
			break;
	}
}

Element.prototype.matchSelector = function(selector){
	if(typeof(this.msMatchesSelector) == "function"){
		return this.msMatchesSelector(selector);
	}else{
		return this.matches(selector);
	}
}
