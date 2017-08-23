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
	var fires = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	];

	var terrainMap = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,2,1,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,2,1,2,0,0,0,0,0,0,0],
		[0,0,0,0,2,2,2,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	];

	/*OBJETOS*/
	var objetos = [];
	//Arena
	objetos[0] = {sx:64, sy:32, sw:32, sh:32};

	//Lava
	objetos[1] = {sx:448, sy:480, sw:32, sh:32};

	//Lava
	objetos[2] = {sx:0, sy:0, sw:32, sh:32};

	// Inicializador
	var init = function	init()	{
		preloadimages(['img/terrain.png']).done(function(img){
			images = img;
			dibujar();
		});
	};

	var get_fires = function function_name() {
		for (var row = 0; row < terrainMap.length ; row++) {
			for (var col = 0; col <= terrainMap[row].length -1; col++) {
				if (terrainMap[row][col] == 1) {
					//fires.push({x: col, y: row});
					fires[row][col] = {x: col, y: row};
				}
			}
		}
	}

	var draw_terrain = function draw_terrain () {
		console.log("dibujando terreno")
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, 450, 450);
		for (var row = 0; row < terrainMap.length ; row++) {
			for (var col = 0; col <= terrainMap[row].length -1; col++) {
				sx = objetos[terrainMap[row][col]].sx;
				sy = objetos[terrainMap[row][col]].sy;
				sw = objetos[terrainMap[row][col]].sw;
				sh = objetos[terrainMap[row][col]].sh;
				ix  = 32 * col;
				iy  = 32 * row;
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
		colLeng = terrainMap.length;
		rowLeng = terrainMap[0].length;
		firesLeng = fires.length;
		console.log("Cantidad de fuegos = " + firesLeng)
		count = 0;
		fire = {};

		for (var row = 0; row < terrainMap.length ; row++) {
			for (var col = 0; col <= terrainMap[row].length -1; col++) {
				fire = fires[row][col];
				
				// LEFT
				if (fire.x - 1 >= 0 && terrainMap[fire.y][fire.x - 1] == 0) {
					//pinto fuego
					terrainMap[fire.y][fire.x - 1] = 1;
				}

				// RIGTH
				if (fire.x + 1 >= 0 && terrainMap[fire.y][fire.x+1] == 0) {
					//pinto fuego
					terrainMap[fire.y][fire.x + 1] = 1;
				}

				// TOP
				if (fire.y - 1 >= 0 && terrainMap[fire.y - 1][fire.x] == 0) {
					//pinto fuego
					terrainMap[fire.y - 1][fire.x] = 1;
				}

				// BOTTOM
				if (fire.y + 1 >= 0 && terrainMap[fire.y + 1][fire.x] == 0) {
					//pinto fuego
					terrainMap[fire.y + 1][fire.x] = 1;
				}
			}
		};
	}

	var dibujar = function dibujar () {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		draw_terrain();
	}

	var loop = function loop() {
		get_fires();
		fire_propagation();
		draw_terrain();
	}

	//Game loop
	/*var loop = function startGameLoop (argument) {
		//if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(dibujar, 100);
	}*/

	game_loop = setInterval(loop, 1000);
	
	//
	init();
})
