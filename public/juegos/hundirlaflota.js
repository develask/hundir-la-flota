document.body.addEventListener('touchmove', function(event) {
  event.preventDefault();
}, false); 
function Tablero(length, id){
    var tablero = [];
    var canvas = document.getElementById(id);
    var barcos = [];
    var onClicked = function(x,y){
        console.log("Coordenadas: ("+x+","+y+")");
    }
    $("#"+id).on("click", function(ev){
        var x1 = parseInt((ev.pageX-canvas.offsetLeft)/40);
        var y1 = parseInt((ev.pageY-canvas.offsetTop)/40);
        onClicked(x1,y1);
    });
    this.onClik = function(func){
        onClicked = func;
    }
    this.reset = function(length){
        $("#numvaso35x35").html("4");
        $("#numcucharilla75X35").html("3");
        $("#numcuchillo115x35").html("2");
        $("#numtenedor155x35").html("1");
        tablero = [];
        if (!length) length = tablero.length;
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
        if (canvas.getContext) {
        var ctx1 = canvas.getContext("2d");
            for(var x=0;x<length;x++){
                for(var y=0;y<length;y++){
                    if((x+y)%2==0){
                        ctx1.fillStyle = "rgb(200,0,0)";
                        ctx1.fillRect (x*40,y*40,(x+1)* 40,(y+1)*40);
                    }else{
                        ctx1.fillStyle = "rgb(255, 255, 255)";
                        ctx1.fillRect (x*40,y*40,(x+1)* 40,(y+1)*40);
                    }
                }
            }
        }
    }
    this.reset(length);
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
    function comprobarBarco(y,x){
        try{
            return tablero[y][x].barco
        }catch(e){
            return false;
        }
    }
    function introducirBarco(arrPosicionInicio, direccion, length, callback){
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
				if (comprobarBarco(y,x-1) || comprobarBarco(y,x) || comprobarBarco(y,x+1)){
					throw new Exception();
				}
			}else{
				if (comprobarBarco(y-1,x) || comprobarBarco(y,x) || comprobarBarco(y+1,x)){
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
                callback(true);
            }else{
                callback(false);
            }
		}catch(e){
			callback(false);
		}
    }
    this.getIndexPos = function(xs,ys){
        var y = ys;
        var x = xs;
        if (tablero[y][x].barco){
            while (y>=0 && tablero[y][x].barco){
                y--;
            }
            y++;
            while (x>=0 && tablero[y][x].barco){
                x--;
            }
            x++;
            return [x,y];
        }else{
            return false;
        }
    }
    this.borrarBarco = function(x,y){
        var inicio = this.getIndexPos(x,y);
        if (inicio){
            for (var i in barcos){
                if (barcos[i].arrPosicionInicio[0] == inicio[0] && barcos[i].arrPosicionInicio[1] == inicio[1]){
                    barcos.splice(i,1);
                    break;
                }
            }
            this.reset(length);
            var barcos_lag = barcos;
            barcos = [];
            for (var i in barcos_lag){
                this.newBarco(barcos_lag[i].arrPosicionInicio, barcos_lag[i].direccion, barcos_lag[i].length, barcos_lag[i].src);
            }
        }
    };
	this.newBarco = function(arrPosicionInicio, direccion, length, src){ // Direccion True = abajo / False = Derecha
        if (parseInt($("#num"+src).text())>0){
		introducirBarco(arrPosicionInicio, direccion, length, function(bool){
            if (bool){
                $("#num"+src).text(parseInt($("#num"+src).text())-1);
                barcos.push({arrPosicionInicio: arrPosicionInicio, direccion: direccion, length: length, src: src});
                var ctx = canvas.getContext('2d');
                var img = new Image();
                img.src = 'img/'+src+(direccion?'_abajo':'_derecha')+'.png';
                img.onload = function(){
                    ctx.drawImage(img, arrPosicionInicio[0]*40 +2.5, arrPosicionInicio[1]*40+2.5);
                }
            }else{
                alert("En esa posicion no puedes meter el barco" + arrPosicionInicio);
            }
        });
        }else{
            alert("No puedes meter mas barcos como ese.");
        }
	}
	this.pulsar = function(x, y){ //
		if (tablero[y][x].pulsado){
			console.log("Eso ya estaba pulsado");
			//throw new Exception();
		}else{
			tablero[y][x].pulsado = true;
            //this.impr();
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
    this.agua = function(x,y){
        tablero[y][x] = {
                    barco: false,
                    pulsado: true
        }
        var ctx = canvas.getContext("2d");
         var img = new Image();
        img.src = 'img/mancha.png'
        img.onload = function(){
            ctx.drawImage(img, x*40, y*40, 40, 40);
        }
    }
    this.tocado = function(x,y){
        var ctx = canvas.getContext("2d");
        ctx.strokeStyle = "rgb(0, 23, 200)";
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.moveTo(x*40, y*40);
        ctx.lineTo(x*40+40, y*40+40);
        ctx.moveTo(x*40+40, y*40);
        ctx.lineTo(x*40, y*40+40);
        ctx.stroke();
        tablero[y][x] = {
                    barco: true,
                    pulsado: true
        }
    }
    this.hundido = function(x,y){
        tablero[y][x] = {
                    barco: true,
                    pulsado: true
        }
        var indPos = this.getIndexPos(x,y);
        var xin = indPos[0];
        var yin = indPos[1];
        var direc = false;
        try {
            if (tablero[yin+1][xin].barco){
                direc = true;
            }
        }catch(e){
            direc = false;
        }
        var count = 0;
        if (direc){
            try{
                while (tablero[yin][xin].barco){
                    yin++;
                    count++;
                }
            }catch(e){
            }
        }else{
            try{
                while (tablero[yin][xin].barco){
                    xin++;
                    count++;
                }
            }catch(e){
            }
        }
        var src = "";
        switch(count){
            case 1:
                src = "vaso35x35";
            break;
            case 2:
                src = "cucharilla75X35";
            break;
            case 3:
                src = "cuchillo115x35";
            break;
            case 4:
                src = "tenedor155x35";
            break;
        }
        var ctx = canvas.getContext('2d');
        var img = new Image();
        img.onload = function(){
            //ctx.drawImage(img, x*40, y*40);
            ctx.drawImage(img, indPos[0]*40 +2.5, indPos[1]*40+2.5);
        }
        img.src = 'img/'+src+(direc?'_abajo':'_derecha')+'manchada.png';
    }
}
var tablero = new Tablero(10, "micanvas1");
tablero.reset(10);
tablero.onClik(function(x,y){
    tablero.borrarBarco(x,y);
});

var tablero2 = new Tablero(10, "micanvas2");
tablero2.reset(10);

if (Modernizr.draganddrop) {

    function start(e,src) {
        console.log(e);
        e.originalEvent.dataTransfer.effectAllowed = 'move';
        e.originalEvent.dataTransfer.setData('text/html', this.innerHTML);

        var dragIcon = document.createElement('img');
        dragIcon.src = src;
        dragIcon.width = 80;
        e.originalEvent.dataTransfer.setDragImage(dragIcon, 20, 20);
        dragIcon.style.opacity = '0.8';
    };
    $("#cubiertos img").on('dragstart', function(ev){
        var src = $(this).attr('src');
        start(ev, src);
    });
//    $("#cubiertos img").on('touchstart', function(ev){
//        ev.preventDefault();
//        var src = $(this).attr('src');
//        start(ev, src);
//    });
    $("#cubiertos img").on('dragend', function(ev){
        var src = $(this).attr('name');
        var d = $(this).attr('dir');
        var luz = $(this).attr('luz');
        var x = ev.originalEvent.pageX;
        var y = ev.originalEvent.pageY;
        var canvas1 = $('#micanvas1');
        var offset = canvas1.offset();
        pintame(parseInt((x - offset.left)/40),parseInt((y - offset.top)/40),src, d=='true', luz);
    });
//    $("#cubiertos img").on('touchend', function(ev){
//        var src = $(this).attr('name');
//        var d = $(this).attr('dir');
//        var luz = $(this).attr('luz');
//        var x = ev.originalEvent.pageX;
//        var y = ev.originalEvent.pageY;
//        var canvas1 = document.getElementById('micanvas1');
//         var l = {};
//        for (el in ev.originalEvent ){
//            if (typeof ev.originalEvent[el] == "number") l[el] = ev.originalEvent[el];
//        }
//        alert(JSON.stringify(ev.originalEvent.targetTouches));
//        alert(JSON.stringify(l));
//        alert(x);
//        alert(canvas1.offsetLeft);
//        pintame(parseInt((x - canvas1.offsetLeft)/40),parseInt((y - canvas1.offsetTop)/40),src, d=='true', luz);
//    });
} else {
  // Fallback to a library solution.
    alert("En  su navegador no se puede jugar");
}
function pintame(x,y, src, onedirection, luz){
    tablero.newBarco([x,y],onedirection,parseInt(luz),src);
}


var ready = 0;
var miTurno = false;
var barc = 0; // CAMBIAR CUANDO MAS BARCOS
var barcmios = 0;
$("#cubiertos span").each(function(e){
    barc += parseInt($(this).text());
    barcmios += parseInt($(this).text());
});
juego.on("resultado", function(dat){
    var que = "";
    switch(dat.result){
        case 0:
            que = "agua";
            tablero2.agua(dat.x, dat.y);
        break;
        case 1:
            que = "tocado";
            tablero2.tocado(dat.x, dat.y);
        break;
        case 2:
            que = "hundido";
            tablero2.tocado(dat.x, dat.y);
            tablero2.hundido(dat.x, dat.y);
            barc--;
            if (barc == 0){
                alert("YOU WIN");
            }
        break;
    }
    miTurno = false;
});
juego.on("jugada", function(datos){
    if (!miTurno){
        var result = tablero.pulsar(datos.x, datos.y);
        tablero.tocado(datos.x, datos.y);
        juego.emit("resultado", {result: result, x: datos.x, y: datos.y});
        if (result == 2) barcmios--;
        if (barcmios == 0){
            alert("YOU LOSE");
        }else{
            $("#jugar").removeClass('btn-danger');
            $("#jugar").addClass('btn-success');
            //alert("Es tu turno");
        }
        miTurno = true;
    }
});
tablero2.onClik(function(x,y){
    //alert("Se ha clicado en: ("+x+","+y+")");
    if (miTurno && tablero2){
        $("#jugar").removeClass('btn-success');
        $("#jugar").addClass('btn-danger');
        juego.emit("jugada", {x:x,y:y});
    }
});

juego.on("acabado", function(datos){
    alert("Tu oponente a acabado de poner los barcos");
    ready += 1;
    if (ready == 2){
        miTurno = true;
        $("#jugar").removeClass('btn-default');
        $("#jugar").addClass('btn-success');
        //alert("Es tu turno");
    }
});

$("#jugar").on("click", function(ev){
    if ($("#numvaso35x35").text() == "0" && $("#numcucharilla75X35").text() == "0" && $("#numcuchillo115x35").text() == "0" && $("#numtenedor155x35").text() == "0"){
        juego.emit("acabado", undefined);
        ready += 1;
        tablero.onClik(function(x,y){
           console.log("Coordenadas: ("+x+","+y+")");
        });
        $("#jugar").off("click");
        if (ready == 2){
            miTurno = false;
            $("#jugar").removeClass('btn-default');
            $("#jugar").addClass('btn-danger');
            //alert("Es el turno de tu oponente");
        }
    }else{
        alert("Todavia tienes que meter algun barco");
    }
});



juego.roomEvent.aceptado(function(ev){
    $("#aleatorioocontraalguiendiv").modal('hide');
    juego.cerrarRoom();
});
juego.roomEvent.joined(function(ev){
    $("#aleatorioocontraalguiendiv").modal('hide');
    juego.grupoCreadoTrue();
    $("#esperando").addClass("hidden");
});
$("#aleatorio").on("click", function(ev){
    $("#esperando").removeClass("hidden");
    juego.joinToRandomRoom();
});
juego.roomEvent.error(function(ev){
    if (ev.error == "Crea tu la habitacion"){
        juego.crearRoom("Random"+Date.now(), []);
    }
});
$("#elegir").on("click", function(ev){
    var nombrejugador=$("#nombrecontrario").val();
    var nombre = user.getName()+Date.now();
    var arrayjugadores=[];
    arrayjugadores.push(nombrejugador);
    console.log(juego);
    juego.crearRoom(nombre,arrayjugadores);
});
$("#aleatorioocontraalguiendiv").modal('show');