function Tablero(length){
	var tablero = [];
    var tt = document.getElementById("table");
    var html = "";
	for (var i = 0; i < length; i++) {
		var li = [];
        html += "<tr>";
		for (var j = 0; j < length; j++) {
			li.push({
				barco: false,
				pulsado: false
			});
            html += "<td id='"+i+"-"+j+"' class='cuadrado'>__</td>"; 
		};
        html += "</tr>";
		tablero.push(li);
	};
    tt.innerHTML = html;
    
	this.impr = function(){
		for (var i = 0; i < tablero.length; i++) {
			var fila = tablero[i];
			var linea = i + " |";
			for (var c = 0; c < fila.length; c++) {
				var t = fila[c];
				linea += " "+(t.barco?"1":"0") + " - " + (t.pulsado?"1":"0")+" |";
                document.getElementById(i+"-"+c).innerHTML = (t.barco?"*":"_")+(t.pulsado?"X":"_")
			};
			//console.log(linea);
		};
	}
    function comprobarBarco(x,y){
        try{
            return tablero[y][x].barco
        }catch(e){
            return false;
        }
    }
	this.newBarco = function(arrPosicionInicio, direccion, length){ // Direccion True = abajo / False = Derecha
		var x = arrPosicionInicio[0];
		var y = arrPosicionInicio[1];
		try{
			if (direccion){ // abajo
				if (comprobarBarco(y-1,x-1) || comprobarBarco(y-1,x) || comprobarBarco(y-1,x+1)){
					throw new Exception();
				}
			}else{ // derecha
				if (comprobarBarco(y-1,x-1) || comprobarBarco(y,x-1) || comprobarBarco(y+1,x-1)){
					throw new Exception();
				}
			}
			for (var i = 0; i < length; i++) {
				if (direccion){ // abajo
					if (comprobarBarco(y,x-1) || comprobarBarco(y,x+1)){
						throw new Exception();
					}
				}else{ // Derecha
					if (comprobarBarco(y-1,x) || comprobarBarco(y+1,x)){
						throw new Exception();
					}
				}
				if (direccion){y++}else{x++}
			};
			if (direccion){ // abajo
				if (comprobarBarco(y+1,x-1) || comprobarBarco(y+1,x) || comprobarBarco(y+1,x+1)){
					throw new Exception();
				}
			}else{
				if (comprobarBarco(y-1,x+1) || comprobarBarco(y,x+1) || comprobarBarco(y+1,x+1)){
					throw new Exception();
				}
			}
			x = arrPosicionInicio[0];
			y = arrPosicionInicio[1];
            if ((direccion?y:x)+length<=tablero.length){
                for (var i = 0; i < length; i++) { // meter barco
                    tablero[y][x].barco = true;
                    if (direccion){y++}else{x++}
                };
            }else{
                console.log("No se puede meter ese barco");
            }
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
            this.impr();
			if (tablero[y][x].barco){
				return hundido(x, y);
			}else{return 0;}
		}
	}
	function hundido(xs,ys,direccion){
		var x = xs;
		var y = ys;
		if (!direccion){
            try{
                var d = hundido(x,y, "derecha");
            }catch(e){
                var d = 2;
            }
            try{
                var i = hundido(x,y, "izquierda");
            }catch(e){
                var i = 2;
            }
            try{
                var ar = hundido(x,y, "arriba");
            }catch(e){
                var ar = 2;
            }
            try{
                var ab = hundido(x,y, "abajo");
            }catch(e){
                var ab = 2;
            }
			if ( d === 2 && i === 2 && ar === 2 && ab === 2){
				return 2;
			}else{
				return 1;
			}
		}else{
            var z = undefined;
            while (z == undefined){
                if (direccion == "derecha"){
                    x--;
                }else if (direccion == "izquierda"){
                    x++;
                }else if (direccion == "arriba"){
                    y--;
                }else if (direccion == "abajo"){
                    y++;
                }
                try{
                    if (!tablero[y][x].barco){
                        z = 2;
                    }else if (tablero[y][x].barco &&  !tablero[y][x].pulsado){
                        z = 1;
                    }
                }catch(e){z = 2;}
            }
            return z;
		}
	}
}
var tablero = new Tablero(10);
tablero.newBarco([5,0],false, 4);
tablero.newBarco([1,2],false, 3);
tablero.newBarco([4,4],true, 1);
tablero.impr();
var cuadrados = document.getElementsByClassName('cuadrado');
for(var ind = 0; ind < cuadrados.length; ind++){
    var cuadrado = cuadrados[ind];
    cuadrado.addEventListener("click", function(ev){
        var id = this.getAttribute("id");
        id = id.split("-");
        var r = tablero.pulsar(id[1],id[0]);
        if (r == 0){
            alert("Agua");
        }else if(r == 1){
            alert("Tocado");
        }else{
            alert("Hundido")
        }
    });
}









var canvas1 = document.getElementById("micanvas1");
var canvas2 = document.getElementById("micanvas2");
if (canvas1.getContext && canvas1.getContext) {
    var ctx1 = canvas1.getContext("2d");
    var ctx2 = canvas2.getContext("2d");
    for(var x=0;x<10;x++){
        for(var y=0;y<10;y++){
            if((x+y)%2==0){
                ctx1.fillStyle = "rgb(200,0,0)";
                ctx1.fillRect (x*40,y*40,(x+1)* 40,(y+1)*40);
                ctx2.fillStyle = "rgb(200,0,0)";
                ctx2.fillRect (x*40,y*40,(x+1)* 40,(y+1)*40);
            }else{
                ctx1.fillStyle = "rgb(255, 255, 255)";
                ctx1.fillRect (x*40,y*40,(x+1)* 40,(y+1)*40);
                ctx2.fillStyle = "rgb(255, 255, 255)";
                ctx2.fillRect (x*40,y*40,(x+1)* 40,(y+1)*40);
            }
        }
    }
}
var canvas1 = document.getElementById("micanvas1");
var ctx1 = canvas1.getContext("2d");
for (var i=40;i<400;i=i+40){
    ctx1.moveTo(i,0);
    ctx2.lineTo(i,400);
}
for (var i=40;i<400;i=i+40){
    ctx1.moveTo(0,i);
    ctx2.lineTo(0,i);
}
ctx1.strokeStyle = "#f00";
ctx1.stroke();
$("#micanvas1").on("click", function(ev){
    var canvas1 = document.getElementById("micanvas1");
    var x1 = parseInt((ev.clientX-canvas1.offsetLeft)/40);
    var y1 = parseInt((ev.clientY-canvas1.offsetTop)/40);
    alert(x1 + "  " + y1);
});
$("#micanvas2").on("click", function(ev){
    var canvas2 = document.getElementById("micanvas2");
    var x2 = parseInt((ev.clientX-canvas2.offsetLeft)/40);
    var y2 = parseInt((ev.clientY-canvas2.offsetTop)/40);
    alert(x2 + "  " + y2);
});