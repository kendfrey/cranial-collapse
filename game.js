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

function BaseGame(extensions)
{
	if (!(this instanceof BaseGame))
	{
		return new BaseGame(extensions);
	}
	
	this.start = function ()
	{
		console.log("start");
		
		for (var i = 0; i < extensions.length; i++)
		{
			extensions[i].start();
		}
	}
	
	this.update = function ()
	{
		for (var i = 0; i < extensions.length; i++)
		{
			extensions[i].update();
		}
	}
	
	this.render = function ()
	{
		
	}
	
	this.end = function ()
	{
		console.log("end");
		
		for (var i = 0; i < extensions.length; i++)
		{
			extensions[i].end();
		}
	}
}

var game = new BaseGame([]);
new GameManager(game);