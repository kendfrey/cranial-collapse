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
			game.start(container);
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
	
	var _this = this;
	
	var updateID, renderID;
	var container;
	
	_this.start = function (containerElement)
	{
		container = containerElement;
		_this.scene = new THREE.Scene();
		var aspectRatio = container.offsetWidth / container.offsetHeight;
		_this.camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.001, 1000);
		_this.camera.rotation.order = "YXZ";
		_this.renderer = new THREE.WebGLRenderer();
		_this.renderer.setSize(container.offsetWidth, container.offsetHeight);
		container.appendChild(_this.renderer.domElement);
		
		for (var i = 0; i < extensions.length; i++)
		{
			extensions[i].start();
		}
		
		updateID = setTimeout(_this.update, 5);
		renderID = requestAnimationFrame(_this.render);
	}
	
	_this.update = function ()
	{
		for (var i = 0; i < extensions.length; i++)
		{
			extensions[i].update();
		}
		
		updateID = setTimeout(_this.update, 5);
	}
	
	_this.render = function ()
	{
		_this.renderer.render(_this.scene, _this.camera);
		
		renderID = requestAnimationFrame(_this.render);
	}
	
	_this.end = function ()
	{
		clearTimeout(updateID);
		cancelAnimationFrame(renderID);
		
		container.removeChild(_this.renderer.domElement);
		
		for (var i = 0; i < extensions.length; i++)
		{
			extensions[i].end();
		}
	}
}

var game = new BaseGame([]);
new GameManager(game);