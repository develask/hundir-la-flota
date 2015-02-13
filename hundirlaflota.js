function Tablero(length){
    var tablero = [];
    
    this.reset = function(length){
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
            console.log("x: "+x+", y: "+y+ "  |  "+tablero[y][x].barco);
            return tablero[y][x].barco
        }catch(e){
            console.log("x: "+x+", y: "+y+ "  |  error")
            return false;
        }
    }
    function introducirBarco(arrPosicionInicio, direccion, length, callback){
        var x = arrPosicionInicio[0];
		var y = arrPosicionInicio[1];
		try{
			/*if (direccion){ // abajo
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
			}*/
            //
            if(direccion){ //abajo
                if(x+length>=10 || y>10){///////////////duda
                    throw new Exception();
                }
                else{
                    for(var i = 0; i<length; i++){
                        if(comprobarBarco(y,x+i)){
                            throw new Exception();
                        }
                    }
                }
            }
            else{//derecha
                if(y+length>=10 || x>10){
                    throw new Exception();
                }
                else{
                    for(var i = 0; i<length; i++){
                        if(comprobarBarco(y+i,x)){
                            throw new Exception();
                        }
                    }
                }
            }
            //
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
    
    var barcos = [];
	this.newBarco = function(arrPosicionInicio, direccion, length, c){ // Direccion True = abajo / False = Derecha
		introducirBarco(arrPosicionInicio, direccion, length, function(bool){
            if (bool){
                barcos.push({arrPosicionInicio: arrPosicionInicio, direccion: direccion, length: length});
                c(true);
            }else{c(false);}
        });
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
}
var tablero = new Tablero(10);
tablero.reset(10);
//tablero.newBarco([5,0],false, 4);
//tablero.newBarco([1,2],false, 3);
//tablero.newBarco([4,4],true, 1);
//tablero.impr();*/
/*
var cuadrados = document.getElementsByClassName('cuadrado');
console.log(cuadrados);
for(var ind = 0; ind < cuadrados.length; ind++){
    var cuadrado = cuadrados[ind];
    console.log("2");
    cuadrado.addEventListener("click", function(ev){
        console.log("3");
        var id = this.getAttribute("id");
        console.log("4");
        id = id.split("-");
        console.log("5");
        var r = tablero.pulsar(id[1],id[0]);
        console.log("6");
        if (r == 0){
            alert("Agua");
        }else if(r == 1){
            alert("Tocado");
        }else{
            alert("Hundido");
        }
    });
}*/

if (Modernizr.draganddrop) {
  // Browser supports HTML5 DnD.
//    $("#cubiertos img").on('dragstart', function(e){
//        console.log(e);
//        e.dataTransfer.setDragImage( -10, -10);
//    });
    function start(e,src) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);

    var dragIcon = document.createElement('img');
    dragIcon.src = 'file:///home/endika/Dropbox/clase/bilbo/3%C2%BA/proiektukudeaketa/hundir-la-flota/'+src;
    //dragIcon.src = 'file:///Users/Jorge/git/hundir-la-flota/'+src;
    dragIcon.width = 80;
    e.dataTransfer.setDragImage(dragIcon, 10, 10);

    // Target element (this) is the source node.
    this.style.opacity = '0.4';
  };
    var cols_ = document.querySelectorAll('#cubiertos .column');
//    [].forEach.call(cols_, function (col) {
//        // Enable columns to be draggable.
//        col.setAttribute('draggable', 'true');
//        col.addEventListener('dragstart', start, false);
//      });
    $("#cubiertos img").on('dragstart', function(ev){
        var src = $(this).attr('src');
        start(ev, src);
    });
    $("#cubiertos img").on('dragend', function(ev){
        var src = $(this).attr('name');
        var d = $(this).attr('dir');
        var luz = $(this).attr('luz');
        var x = ev.originalEvent.pageX;
        var y = ev.originalEvent.pageY;
        var canvas1 = document.getElementById('micanvas1');
        //pintame(parseInt((x - canvas1.offsetLeft)/40),parseInt((y - canvas1.offsetTop)/40),src, d=='true', luz);
        pintame(parseInt((x - canvas1.offsetLeft)/40),parseInt((y - canvas1.offsetTop -20)/40),src, d=='true', luz);
    });
} else {
  // Fallback to a library solution.
    alert("En  su navegador no se puede jugar");
}

    
function pintame(x,y, src, onedirection, luz){
    tablero.newBarco([x,y],onedirection,parseInt(luz), function(b){
        if (b){
            var canvas1 = document.getElementById('micanvas1');
            var ctx = canvas1.getContext('2d');
            var img = new Image();///Users/mikel/Desktop/projectos/hundir la flota
            //img.src = 'file:///Users/mikel/Desktop/projectos/hundir la flota/public/img/'+src+(onedirection?'_abajo':'_derecha')+'.png';
            img.src = 'file:///home/endika/Dropbox/clase/bilbo/3%C2%BA/proiektukudeaketa/hundir-la-flota/public/img/'+src+(onedirection?'_abajo':'_derecha')+'.png';
            img.onload = function(){
                //ctx.drawImage(img, x*40, y*40);
                ctx.drawImage(img, x*40 +2.5, y*40+2.5);
            }
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
    var x1 = parseInt((ev.pageX-canvas1.offsetLeft)/40);
    var y1 = parseInt((ev.pageY-canvas1.offsetTop)/40);
    alert(x1 + "  " + y1);
});
$("#micanvas2").on("click", function(ev){
    var canvas2 = document.getElementById("micanvas2");
    var x2 = parseInt((ev.pageX-canvas2.offsetLeft)/40);
    var y2 = parseInt((ev.pageY-canvas2.offsetTop)/40);
    alert(x2 + "  " + y2);
});