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
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,2,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,2,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,2,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,2,0,0],
		[0,0,0,0,0,2,0,0,0,0,0,2,0,0],
		[0,0,0,0,2,0,2,0,0,0,0,2,0,0],
		[0,0,0,0,2,0,2,0,0,0,0,2,0,0],
		[0,0,0,0,2,0,2,0,0,0,0,0,0,0],
		[0,0,0,0,0,2,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,1,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	];

	/*OBJETOS*/
	var objetos = [];
	//Arena
	objetos[0] = {sx:64, sy:32, sw:32, sh:32};

	//Lava
	objetos[1] = {sx:448, sy:480, sw:32, sh:32};

	//Lava2
	objetos[8] = {sx:128, sy:480, sw:32, sh:32};

	//Lava
	objetos[2] = {sx:0, sy:0, sw:32, sh:32};

	// Inicializador
	var init = function	init()	{
		preloadimages(['img/terrain.png']).done(function(img){
			images = img;
			dibujar();
		});
	};

	var draw_terrain = function draw_terrain () {
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, 450, 450);
		for (var fila = 0; fila < terrainMap.length ; fila++) {
			for (var col = 0; col <= terrainMap[fila].length -1; col++) {
				sx = objetos[terrainMap[fila][col]].sx;
				sy = objetos[terrainMap[fila][col]].sy;
				sw = objetos[terrainMap[fila][col]].sw;
				sh = objetos[terrainMap[fila][col]].sh;
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
				if (terrainMap[fila][col] == 1) {// Si estoy en una casilla con fuego:
					// LEFT
					if (col - 1 >= 0) {
						if (terrainMap[fila][col - 1] == 0) {// El material no es fuego?
							nextTerrainMap[fila][col - 1] = 1; //pinto fuego es esa casilla
						}
					};

					//RIGTH
					if (col + 1 >= 0) {
						if (terrainMap[fila][col + 1] == 0) {
							nextTerrainMap[fila][col + 1] = 1;
						}
					};

					// TOP
					if (fila - 1 >= 0) {
						if (terrainMap[fila - 1][col] == 0) {
							nextTerrainMap[fila - 1][col] = 1;
						}
					};

					// BOTTOM
					if (fila + 1 >= 0 && fila + 1 < filaLeng) {
						if (terrainMap[fila + 1][col] == 0) {
							nextTerrainMap[fila + 1][col] = 1;
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

	var dibujar = function dibujar () {
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
