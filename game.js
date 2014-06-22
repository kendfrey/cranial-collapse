function GameManager(game)
{
	if (!(this instanceof GameManager))
	{
		return new GameManager(game);
	}
	
	window.addEventListener("load", onLoad);
	document.addEventListener("pointerlockchange", onPointerLockChange);
	document.addEventListener("mozpointerlockchange", onPointerLockChange);
	document.addEventListener("webkitpointerlockchange", onPointerLockChange);
	document.addEventListener("mspointerlockchange", onPointerLockChange);
	
	var container;
	
	function onLoad()
	{
		container = document.getElementById("game");
		container.addEventListener("click", start);
	}
	
	function start()
	{
		var pointerLockElement = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement;
		if (pointerLockElement !== container)
		{
			container.requestPointerLock = container.requestPointerLock || container.mozRequestPointerLock || container.webkitRequestPointerLock || container.msRequestPointerLock;
			container.requestPointerLock();
		}
	}
	
	function onPointerLockChange()
	{
		var pointerLockElement = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement;
		if (pointerLockElement === container)
		{
			game.start();
		}
		else
		{
			game.end();
		}
	}
}

var testGame = { start: function () { console.log("start"); }, end: function () { console.log("end"); } };

new GameManager(testGame);