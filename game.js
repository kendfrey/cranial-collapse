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
	
	_this.mesh = {};
	_this.material = {};
	
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
		
		var geometry;
		
		_this.material.wall = _this.createTextureMaterial("wall.png");
		
		geometry = _this.createTexturedPlane(1, 1);
		_this.mesh.wallN = new THREE.Mesh(geometry, _this.material.wall);
		_this.mesh.wallN.position.x = 0.5;
		_this.mesh.wallN.position.y = 0.5;
		_this.mesh.wallN.position.z = -20;
		_this.scene.add(_this.mesh.wallN);
		
		geometry = _this.createTexturedPlane(20, 1);
		_this.mesh.wallE = new THREE.Mesh(geometry, _this.material.wall);
		_this.mesh.wallE.position.x = 1;
		_this.mesh.wallE.position.y = 0.5;
		_this.mesh.wallE.position.z = -10;
		_this.mesh.wallE.rotation.y = Math.PI * 1.5;
		_this.scene.add(_this.mesh.wallE);
		
		geometry = _this.createTexturedPlane(1, 1);
		_this.mesh.wallS = new THREE.Mesh(geometry, _this.material.wall);
		_this.mesh.wallS.position.x = 0.5;
		_this.mesh.wallS.position.y = 0.5;
		_this.mesh.wallS.position.z = 0;
		_this.mesh.wallS.rotation.y = Math.PI * 1;
		_this.scene.add(_this.mesh.wallS);
		
		geometry = _this.createTexturedPlane(20, 1);
		_this.mesh.wallW = new THREE.Mesh(geometry, _this.material.wall);
		_this.mesh.wallW.position.x = 0;
		_this.mesh.wallW.position.y = 0.5;
		_this.mesh.wallW.position.z = -10;
		_this.mesh.wallW.rotation.y = Math.PI * 0.5;
		_this.scene.add(_this.mesh.wallW);
		
		geometry = _this.createTexturedPlane(1, 20);
		_this.mesh.floor = new THREE.Mesh(geometry, _this.material.wall);
		_this.mesh.floor.position.x = 0.5;
		_this.mesh.floor.position.y = 0;
		_this.mesh.floor.position.z = -10;
		_this.mesh.floor.rotation.x = Math.PI * 1.5;
		_this.scene.add(_this.mesh.floor);
		
		geometry = _this.createTexturedPlane(1, 20);
		_this.mesh.ceiling = new THREE.Mesh(geometry, _this.material.wall);
		_this.mesh.ceiling.position.x = 0.5;
		_this.mesh.ceiling.position.y = 1;
		_this.mesh.ceiling.position.z = -10;
		_this.mesh.ceiling.rotation.x = Math.PI * 0.5;
		_this.scene.add(_this.mesh.ceiling);
		
		_this.reset();
		
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
	
	_this.reset = function ()
	{
		_this.camera.position.x = 0.5;
		_this.camera.position.y = 0.5;
		_this.camera.position.z = -0.5;
		_this.camera.rotation.set(0, 0, 0);
	}
	
	_this.createTextureMaterial = function (path)
	{
		var texture = THREE.ImageUtils.loadTexture(path);
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		return new THREE.MeshBasicMaterial({ map: texture });
	}
	
	_this.createTexturedPlane = function (width, height)
	{
		var geometry = new THREE.PlaneGeometry(width, height);
		geometry.faceVertexUvs[0][0][0] = new THREE.Vector2(0, height);
		geometry.faceVertexUvs[0][0][1] = new THREE.Vector2(0, 0);
		geometry.faceVertexUvs[0][0][2] = new THREE.Vector2(width, height);
		geometry.faceVertexUvs[0][1][0] = new THREE.Vector2(0, 0);
		geometry.faceVertexUvs[0][1][1] = new THREE.Vector2(width, 0);
		geometry.faceVertexUvs[0][1][2] = new THREE.Vector2(width, height);
		return geometry;
	}
}

var game = new BaseGame([]);
new GameManager(game);