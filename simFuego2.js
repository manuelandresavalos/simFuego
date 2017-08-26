/*
TODO:
	* Cargar las imagenes al principio y ejecutar un evento de "Carga completada" para iniciar el juego, no el anidamiento de loaders de imagenes.
	* Redefinir var objetos[] ya que también tenemos items, y los items son objetos también. items = items | objetos = terrainObjects
*/

$(document).ready(function(){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var images = [];
	var game_loop;
	var terrainMap = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,3,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,1,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,3,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,3,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,3,0,0],
		[0,0,0,0,0,7,7,7,1,0,0,3,0,1],
		[0,0,0,0,7,0,7,0,0,0,0,3,0,0],
		[0,0,0,0,7,0,7,0,0,0,0,3,0,0],
		[0,0,0,0,7,0,7,0,0,0,0,0,0,0],
		[0,0,0,0,7,7,7,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,8,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	];

	/*OBJETOS*/
	var objetos = [];
	//Arena
	objetos[0] = {id:'arena', posArray:0, fuel:0, sx:64, sy:32, sw:32, sh:32};

	//Fuego
	objetos[1] = {id:'fuego', posArray:1, fuel:0, burnPower:100, sx:448, sy:480, sw:32, sh:32};

	//Tierra
	objetos[2] = {id:'tierra', posArray:2, fuel:0, sx:64, sy:0, sw:32, sh:32};

	//Suelo cemento blando
	objetos[3] = {id:'suelo_cemento_blando', posArray:3, fuel:0, sx:0, sy:0, sw:32, sh:32};

	//Suelo cemento duro
	objetos[4] = {id:'suelo_cemento_duro', posArray:4, fuel:0, sx:32, sy:0, sw:32, sh:32};

	//Diamante
	objetos[5] = {id:'diamante', posArray:5, fuel:0, sx:64, sy:96, sw:32, sh:32};

	//Agua
	objetos[6] = {id:'agua', posArray:6, fuel:-10, sx:448, sy:416, sw:32, sh:32};

	//Madera
	objetos[7] = {id:'madera', posArray:7, fuel:100, sx:160, sy:32, sw:32, sh:32};

	//Ceniza
	objetos[8] = {id:'ceniza', posArray:8, fuel:0, sx:160, sy:64, sw:32, sh:32};

	// Inicializador
	var init = function	init()	{
		preloadimages(['img/terrain.png']).done(function(img){
			images = img;
			initTerrain();
		});
		
		for (var fila = 0; fila < terrainMap.length ; fila++) {
			for (var col = 0; col <= terrainMap[fila].length -1; col++) {
				//Agrego cada objeto en la casilla que le corresponde.
				terrainMap[fila][col] = objetos[terrainMap[fila][col]];
			}
		}
	};

	var draw_terrain = function draw_terrain () {
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, 450, 450);
		for (var fila = 0; fila < terrainMap.length ; fila++) {
			for (var col = 0; col <= terrainMap[fila].length -1; col++) {
				//Seteo las variables para poder dibujar en el tablero
				var obj = terrainMap[fila][col];
				sx = objetos[obj.posArray].sx;
				sy = objetos[obj.posArray].sy;
				sw = objetos[obj.posArray].sw;
				sh = objetos[obj.posArray].sh;
				ix  = 32 * col;
				iy  = 32 * fila;
				iw  = 32;
				ih  = 32;

				/* COMO SETEAR LOS VALORES CORRECTAMENTE */
				// sx 		= 0;	// Pos x del punto de inicio
				// sy 		= 0;	// Pos y del punto de inicio
				// swidth	= 32;	// Ancho del punto de inicio
				// sheight	= 32;	// Alto del punto de inicio
				// x		= 0; 	// Pos x a donde quiero poner la imagen
				// y		= 0;	// Pos y a donde quiero poner la imagen
				// width 	= 32;	// Ancho del punto de final a donde quiero poner la imagen
				// height 	= 32;	// Alto del punto de final a donde quiero poner la imagen
				ctx.drawImage(images[0], sx, sy, sw, sh, ix, iy, iw, ih);
			};
		};
	}

	var fire_propagation = function fire_propagation () {
		var nextTerrainMap = new Array();
		filaLeng = terrainMap[0].length;
		colLeng = terrainMap.length;

		for (var fila = 0; fila < terrainMap.length ; fila++) {
			nextTerrainMap[fila] = new Array();
			for (var col = 0; col < terrainMap[fila].length; col++) {
				nextTerrainMap[fila][col] = 0;
			}
		}

		for (var fila = 0; fila < terrainMap.length ; fila++) {
			for (var col = 0; col < terrainMap[fila].length; col++) {
				var objetoPrincipal = terrainMap[fila][col];
				if (terrainMap[fila][col].id == 'fuego') {// Si estoy en una casilla con fuego:
					// LEFT
					if (col - 1 >= 0) {
						if (terrainMap[fila][col - 1].id != 'fuego') {// El material no es fuego?
							if (checkIteractionWithFire(objetoPrincipal, terrainMap[fila][col - 1])) {
								nextTerrainMap[fila][col - 1] = objetos[1]; //pinto fuego es esa casilla
							}
						}
					};

					//RIGTH
					if (col + 1 >= 0 && terrainMap[fila][col + 1] != undefined) {
						if (terrainMap[fila][col + 1].id != 'fuego') {
							if (checkIteractionWithFire(objetoPrincipal, terrainMap[fila][col + 1])) {
								nextTerrainMap[fila][col + 1] = objetos[1]; //pinto fuego es esa casilla
							}
						}
					};

					// TOP
					if (fila - 1 >= 0) {
						if (terrainMap[fila - 1][col].id != 'fuego') {
							if (checkIteractionWithFire(objetoPrincipal, terrainMap[fila - 1][col])) {
								nextTerrainMap[fila - 1][col] = objetos[1]; //pinto fuego es esa casilla
							}
						}
					};

					// BOTTOM
					if (fila + 1 >= 0 && fila + 1 < filaLeng) {
						if (terrainMap[fila + 1][col].id != 'fuego') {
							if (checkIteractionWithFire(objetoPrincipal, terrainMap[fila + 1][col])) {
								nextTerrainMap[fila + 1][col] = objetos[1]; //pinto fuego es esa casilla
							}
						}
					}
				}
			}
		};

		for (var fila = 0; fila < nextTerrainMap.length ; fila++) {
			for (var col = 0; col < nextTerrainMap[fila].length; col++) {
				if (nextTerrainMap[fila][col] != 0) {
					terrainMap[fila][col] = nextTerrainMap[fila][col];
				}
			}
		}
	}

	var checkIteractionWithFire = function checkIteractionWithFire(fire, objetoSecundario) {
		var hasBurn = false;
		if (objetoSecundario.fuel > 0) {
			objetoSecundario.fuel - fire.burnPower;
			if (objetoSecundario.fuel < 0) {
				objetoSecundario.fuel = 0;
			}
			hasBurn = true;
		}
		return hasBurn;
	}
	var initTerrain = function initTerrain () {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		draw_terrain();
	}

	var loop = function loop() {
		fire_propagation();
		draw_terrain();
	}

	game_loop = setInterval(loop, 1000);
	
	//
	init();
})
