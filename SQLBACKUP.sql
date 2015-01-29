-- MySQL dump 10.13  Distrib 5.6.19, for osx10.7 (i386)
--
-- Host: localhost    Database: hundirlaflota
-- ------------------------------------------------------
-- Server version	5.5.41-0+wheezy1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `juego`
--

DROP TABLE IF EXISTS `juego`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `juego` (
  `idjuego` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  `reglas` text,
  `codigohtml` longtext NOT NULL,
  `codigojavascript` longtext NOT NULL,
  PRIMARY KEY (`idjuego`),
  UNIQUE KEY `idjuego_UNIQUE` (`idjuego`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `juego`
--

LOCK TABLES `juego` WRITE;
/*!40000 ALTER TABLE `juego` DISABLE KEYS */;
INSERT INTO `juego` VALUES (1,'Hundir La Mesa','<h4>Tableros</h4>\n                  <p>En uno de los tableros, el jugador coloca sus barcos y registra los «tiros» del oponente; en el otro, se registran los tiros propios, al tiempo que se deduce la posición de los barcos del contrincante.</p>\n                  <h4>Naves</h4>\n                  <p>Al comenzar, cada jugador posiciona sus barcos en el primer tablero, de forma secreta, invisible al oponente.</p>\n                  <p>Cada quien ocupa, según sus preferencias, una misma cantidad de casillas, horizontal y/o verticalmente, las que representan sus naves. Ambos participantes deben ubicar igual el número de naves, por lo que es habitual, antes de comenzar, estipular de común acuerdo la cantidad y el tamaño de las naves que se posicionarán en el tablero. Así, por ejemplo, cinco casillas consecutivas conforman un portaaviones; tres, un buque, y una casilla aislada, una lancha, y los participantes podrían convenir, también a modo de ejemplo, en colocar, cada uno, dos portaaviones, tres buques y cinco lanchas.</p>\n                  <h4>Desarrollo del juego</h4>\n                  <p>Una vez todas las naves han sido posicionadas, se inicia una serie de rondas. En cada ronda, cada jugador en su turno «dispara» hacia la flota de su oponente indicando una posición (las coordenadas de una casilla), la que registra en el segundo tablero. Si esa posición es ocupada por parte de un barco contrario, el oponente cantará ¡Averiado! (¡Toque! o ¡Tocado!) si todavía quedan partes del barco (casillas) sin dañar, o ¡Hundido! si con ese disparo la nave ha quedado totalmente destruida (esto es, si la acertada es la última de las casillas que conforman la nave que quedaba por acertar). Si la posición indicada no corresponde a una parte de barco alguno, cantará ¡Agua!.</p>\n                  <p>Cada jugador referenciará en ese segundo tablero, de diferente manera y a su conveniencia, los disparos que han caído sobre una nave oponente y los que han caído al mar: en la implementación del juego con lápiz y papel, pueden señalarse con una cruz los tiros errados y con un círculo los acertados a una nave, o con cuadrados huecos y rellenos, como se ve en la imagen; en la versión con pizarras, se utilizan pines de un color para los aciertos y de otro para las marras.</p>\n                  <h4>Fin del juego</h4>\n                  <p>El juego puede terminar con un ganador o en empate:</p>\n                  <ul>\n                      <li>hay ganador: <p>Quien descubra, quien destruya primero todas las naves de su oponente será el vencedor (como en tantos otros juegos en los que se participa por turnos, en caso de que el participante que comenzó la partida hunda en su última jugada el último barco de su oponente que quedaba a flote, el otro participante tiene derecho a una última posibilidad para alcanzar el empate, a un último disparo que también le permita terminar de hundir la flota contraria, lo que supondría un empate);</p>\n                      </li>\n                      <li>empate: <p>Si bien lo habitual es continuar el juego hasta que haya un ganador, el empate también puede alcanzarse si, tras haber disparado cada jugador una misma cantidad de tiros fija y predeterminada (como una variante permitida en el juego), ambos jugadores han acertado en igual número de casillas contrarias.</p>\n                      </li>\n                  </ul>','<canvas  id=\"micanvas1\" width=\"400\" height=\"400\">Su navegador no soporta en elemento CANVAS</canvas>\n            <canvas  id=\"micanvas2\" width=\"400\" height=\"400\">Su navegador no soporta en elemento CANVAS</canvas>','var canvas1 = document.getElementById(\"micanvas1\");     var canvas2 = document.getElementById(\"micanvas2\");     if (canvas1.getContext && canvas1.getContext) {         var ctx1 = canvas1.getContext(\"2d\");         var ctx2 = canvas2.getContext(\"2d\");             for(var x=0;x<10;x++){                 for(var y=0;y<10;y++){                     if((x+y)%2==0){                         ctx1.fillStyle = \"rgb(200,0,0)\";                         ctx1.fillRect (x*40,y*40,(x+1)* 40,(y+1)*40);                         ctx2.fillStyle = \"rgb(200,0,0)\";                         ctx2.fillRect (x*40,y*40,(x+1)* 40,(y+1)*40);                     }else{                         ctx1.fillStyle = \"rgb(255, 255, 255)\";                         ctx1.fillRect (x*40,y*40,(x+1)* 40,(y+1)*40);                         ctx2.fillStyle = \"rgb(255, 255, 255)\";                         ctx2.fillRect (x*40,y*40,(x+1)* 40,(y+1)*40);                     }                 }             }     }        var canvas1 = document.getElementById(\"micanvas1\");     var ctx1 = canvas1.getContext(\"2d\");     for (var i=40;i<400;i=i+40){         ctx1.moveTo(i,0);         ctx2.lineTo(i,400);     }     for (var i=40;i<400;i=i+40){         ctx1.moveTo(0,i);         ctx2.lineTo(0,i);     }     ctx1.strokeStyle = \"#f00\";                                                                         ctx1.stroke();    document.getElementById(\"juegoActual\").text=\"Hundir La Mesa\";    $(\"#micanvas1\").on(\"click\", function(ev){\n    var canvas1 = document.getElementById(\"micanvas1\");\n    var x1 = parseInt((ev.clientX-canvas1.offsetLeft)/40);\n    var y1 = parseInt((ev.clientY-canvas1.offsetTop)/40);\n    alert(x1 + \"  \" + y1);\n    \n});\n\n$(\"#micanvas2\").on(\"click\", function(ev){\n    var canvas2 = document.getElementById(\"micanvas2\");\n    var x2 = parseInt((ev.clientX-canvas2.offsetLeft)/40);\n    var y2 = parseInt((ev.clientY-canvas2.offsetTop)/40);\n    alert(x2 + \"  \" + y2);\n});');
/*!40000 ALTER TABLE `juego` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partida`
--

DROP TABLE IF EXISTS `partida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `partida` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `j1` int(11) NOT NULL,
  `j2` int(11) NOT NULL DEFAULT '-1',
  `ganador` tinyint(1) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechafin` datetime DEFAULT NULL,
  `juego` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `j1_idx` (`j1`),
  KEY `j2_idx` (`j2`),
  KEY `juego_idx` (`juego`),
  CONSTRAINT `juego` FOREIGN KEY (`juego`) REFERENCES `juego` (`idjuego`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `j1` FOREIGN KEY (`j1`) REFERENCES `users` (`ident`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `j2` FOREIGN KEY (`j2`) REFERENCES `users` (`ident`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partida`
--

LOCK TABLES `partida` WRITE;
/*!40000 ALTER TABLE `partida` DISABLE KEYS */;
/*!40000 ALTER TABLE `partida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `nombre` varchar(45) NOT NULL,
  `contraseña_hash` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `ident` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`nombre`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`),
  UNIQUE KEY `ident_UNIQUE` (`ident`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('endika','308e6c4323eb0250b9fed96def28bc95e9d73d56','endikap100@hotmail.com',4),('i2','7ee105582bc5e7335a2a87e8891e9251e764dae7','gambito_69_laska@hotmail.com',9),('ieltzu','abae2dd5c1a127b595094cad32f3ef91a3124e96','ieltzu@gmail.com',2),('Jorge','9516cff1868b9e7ce8a006d2246dc040cc082676','jorgenietoaz@gmail.com',3),('mikel','e55ca00816a3e28929a6db4aeef1391a7a02394b','develascomikel@gmail.com',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification`
--

DROP TABLE IF EXISTS `verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verification` (
  `name` varchar(45) NOT NULL,
  `pass` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `time` int(11) DEFAULT '2',
  PRIMARY KEY (`name`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification`
--

LOCK TABLES `verification` WRITE;
/*!40000 ALTER TABLE `verification` DISABLE KEYS */;
INSERT INTO `verification` VALUES ('mama','4e113d4422730be62435f72a284bd851806ec95a','develascomikel@gmail.com',2);
/*!40000 ALTER TABLE `verification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'hundirlaflota'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `deleteVerifications` */;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8 */ ;;
/*!50003 SET character_set_results = utf8 */ ;;
/*!50003 SET collation_connection  = utf8_general_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = '' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `deleteVerifications` ON SCHEDULE EVERY 24 HOUR STARTS '2015-01-28 19:05:08' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM hundirlaflota.verification where time = 0 */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
/*!50106 DROP EVENT IF EXISTS `updateVerifications` */;;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8 */ ;;
/*!50003 SET character_set_results = utf8 */ ;;
/*!50003 SET collation_connection  = utf8_general_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = '' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `updateVerifications` ON SCHEDULE EVERY 24 HOUR STARTS '2015-01-28 19:05:08' ON COMPLETION NOT PRESERVE ENABLE DO UPDATE hundirlaflota.verification SET time=time-1 WHERE time>0 */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
DELIMITER ;
/*!50106 SET TIME_ZONE= @save_time_zone */ ;

--
-- Dumping routines for database 'hundirlaflota'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-01-29 20:50:11
