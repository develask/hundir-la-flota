function Tablero(length){
	var tablero = [];
	for (var i = 0; i < length; i++) {
		var li = [];
		for (var j = 0; j < length; j++) {
			li.push({
				barco: false,
				pulsado: false
			});
		};
		tablero.push(li);
	};
	this.impr = function(){
		for (var i = 0; i < tablero.length; i++) {
			var fila = tablero[i];
			var linea = i + " |";
			for (var c = 0; c < fila.length; c++) {
				var t = fila[c];
				linea += " "+(t.barco?"1":"0") + " - " + (t.pulsado?"1":"0")+" |";
			};
			console.log(linea);
		};
	}
	this.newBarco = function(arrPosicionInicio, direccion, length){ // Direccion True = abajo / False = Derecha
		var x = arrPosicionInicio[0];
		var y = arrPosicionInicio[1];
		try{
			if (direccion){ // abajo
				if (tablero[y-1][x-1].barco || tablero[y-1][x].barco || tablero[y-1][x+1].barco){
					throw new Exception();
				}
			}else{
				if (tablero[y-1][x-1].barco || tablero[y][x-1].barco || tablero[y+1][x-1].barco){
					throw new Exception();
				}
			}
			for (var i = 0; i < length; i++) {
				if (direccion){ // abajo
					if (tablero[y][x-1].barco || tablero[y][x+1].barco){
						throw new Exception();
					}
				}else{ // Derecha
					if (tablero[y-1][x].barco || tablero[y+1][x].barco){
						throw new Exception();
					}
				}
				if (direccion){y++}else{x++}
			};
			if (direccion){ // abajo
				if (tablero[y+1][x-1].barco || tablero[y+1][x].barco || tablero[y+1][x+1].barco){
					throw new Exception();
				}
			}else{
				if (tablero[y-1][x+1].barco || tablero[y][x+1].barco || tablero[y+1][x+1].barco){
					throw new Exception();
				}
			}
			x = arrPosicionInicio[0];
			y = arrPosicionInicio[1];
			for (var i = 0; i < length; i++) { // meter barco
				tablero[y][x].barco = true;
				if (direccion){y++}else{x++}
			};
		}catch(e){
			console.log("No se puede meter ese barco");
		}
	}
	this.pulsar = function(x, y){ // 
		if (tablero[y][x].pulsado){
			console.log("Eso ya estaba pulsado");
			throw new Exception();
		}else{
			tablero[y][x].pulsado = true;
			if (tablero[y][x].barco){
				if (hundido(x,y)){
					return 2;
				}else{
					return 1;
				}
			}else{return 0;}
		}
	}
	function hundido(xs,ys,direccion){
		var x = xs;
		var y = ys;
		if (!direccion){
			if (hundido(y-1,x, "derecha") == 2 && hundido(y+1,x, "izuierda") == 2){
				return 2;
			}else if (hundido(y,x-1, "arriba") == 2 && hundido(y,x+1, "abajo") == 2){
				return 2;
			}else{
				return 1
			}
		}else{
			if (direccion == "derecha"){
				y--;
			}else if (direccion == "izquierda"){
				y++;
			}else if (direccion == "arriba"){
				x--;
			}else if (direccion == "derecha"){
				x++;
			}
			if (!tablero[y][x].barco){
				return 2;
			}else if (tablero[y][x].barco &&  !tablero[y][x].pulsado){
				return 1;
			}else{
				return hundido(x,y, direccion);
			}
		}
	}
}
var tablero = new Tablero(10);
tablero.newBarco([3,3],false, 4);
tablero.newBarco([1,1],true, 3);
tablero.newBarco([2,0], false, 4);
tablero.impr()