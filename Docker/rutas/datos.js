 const {Router} = require('express');
 const router = Router();
 const mysql = require('mysql');

//se crea la conexión a mysql

 const connection = mysql.createPool({
        connectionLimit:500,
        host: process.env.MYSQL_HOST,
        port:process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DATABASE,
 });

 //console.log(process.env.MYSQL_HOST);
//===================================== G A T E W A Y =====================================
router.get('/lora-gateway', (req,res) => {
        var json1 = {};          //variable para almacenar cada registro que se lea, en formato json
        var arreglo=[];
        connection.getConnection(function(error, tempConn){      //conexion a mysql
                if(error){
                        throw error; //si no se pudo conectar
                }else{
                        console.log('Conexion correcta');
                        //ejecución de la consulta
                        tempConn.query('SELECT * FROM datos', function(error, result){
                                var resultado=result;   //se almacena el resultado de la consulta en la variable resultado

                                if(error){
                                        throw error;
                                        res.send('error en la ejecución del query');
                                }else{
                                        tempConn.release();      //se librea la conexión
                                        for (i=0;i<resultado.length; i++){
                                                json1={ "id":resultado[i].id,
                                                        "latitud":resultado[i].latitud,
                                                        "longitud":resultado[i].longitud,
                                                        "rssi":resultado[i].rssi,
                                                        "snr":resultado[i].snr,
                                                        "gateway":resultado[i].gateway,
                                                        "frecuencia":resultado[i].frecuencia,
                                                        "fecha":resultado[i].fecha
                                                        };
                                                console.log(json1);      //se muestra el json en la consola
                                                arreglo.push(json1);     //se añade el json al arreglo
                                        }
                                        res.json(arreglo); //se retorna el arreglo
                                }                      
                        });
                }
        });
});

router.get('/lora-gateway-post1/:latitud/:longitud/:rssi/:snr/:gate/:frec', (req,res) => {
        var lat=req.params.latitud;
        var lon=req.params.longitud;
        var rssi=req.params.rssi;
        var snr=req.params.snr;
        var gate=req.params.gate;
        var frec=req.params.frec;
        var json1 = {};


        connection.getConnection(function(error, tempConn){
                if(error){
                        throw error;
                }else{
                        console.log('Conexion correcta');
			
                        tempConn.query('INSERT INTO datos VALUES(null,?,?,?,?,?,?,null)', [lon, lat, rssi, snr, frec, gate], function(error, result){
                                if(error){
                                        throw error;
                                        res.send ("error al ejecutar el query");
                                }else{
                                        tempConn.release();
                                //      res.json(json1);
                                        res.send("datos almacenados.");
                                }
                        });
                }
        });
});

router.post('/lora-gateway-post2', (req,res) => {
        console.log(req.body);
        json1 = req.body;
        connection.getConnection(function(error, tempConn){
                if(error){
                        throw error;
                }else{
                        console.log('Conexion correcta');
                        tempConn.query('INSERT INTO datos VALUES(null,?,?,?,?,?,?,null)', [json1.longitud, json1.latitud, json1.rssi, json1.snr,  json1.frecuencia, json1.gateway], function(error, result){
                                if(error){
                                        throw error;
                                        res.send ("error al ejecutar el query");
                                }else{
                                        tempConn.release();
                                        res.json(json1);
                                        //res.send("datos almacenados");   //mensaje de respuesta
                                }
                        });

                }
        });
});


router.get('/lora-gateway-param/:frec/:gate', (req,res) => {
        var frecb=req.params.frec;
        var gateb=req.params.gate;
        var json1 = {};
        var arreglo=[];
        connection.getConnection(function(error, tempConn){
                if(error){
                        throw error;
                }else{
                        console.log('Conexion correcta');
                        tempConn.query('SELECT * FROM datos WHERE frecuencia=? and gateway=?',[frecb,gateb], function(error, result){
                                var resultado=result;

                                if(error){
                                        throw error;
                                        res.send('error en la ejecución del query');
                                }else{
                                        tempConn.release();
                                        for (i=0;i<resultado.length; i++){

                                                json1={ "id":resultado[i].id,
                                                        "latitud":resultado[i].latitud,
                                                        "longitud":resultado[i].longitud,
                                                        "rssi":resultado[i].rssi,
                                                        "snr":resultado[i].snr,
                                                        "gateway":resultado[i].gateway,
                                                        "frecuencia":resultado[i].frecuencia,
                                                        "fecha":resultado[i].fecha
                                                        };
                                                console.log(json1);
                                                arreglo.push(json1);
                                        }
                                        res.json(arreglo);
                                }
                        });
                }
        });
});


router.delete('/lora-gateway-param/:frec/:gate', (req,res) => {
        var json1 = {};
        var arreglo=[];
        var frecb=req.params.frec;
        var gateb=req.params.gate;

        connection.getConnection(function(error, tempConn){
                if(error){
                        throw error;
                }else{
                        console.log('Conexion correcta.');
                        tempConn.query('DELETE from datos where frecuencia=? and gateway=?',[frecb,gateb], function(error, result){
                                if(error){
                                        throw error;
                                        res.send ("error al ejecutar el query");
                                }else{
                                        tempConn.release();
                                        res.send("Gateway "+gateb+" con frecuencia "+frecb+" eliminado");
                                }
                        });
                }
        });
});

//===================================== S P I N N E R =====================================

router.get('/spinner', (req,res) => {
        var json1 = {};
        var arreglo=[];
        connection.getConnection(function(error, tempConn){
                if(error){
                        throw error;
                }else{
                        console.log('Conexion correcta');
		        tempConn.query('SELECT * FROM spinner', function(error, result){
                                var resultado=result;

                                if(error){
                                        throw error;
                                        res.send('error en la ejecución del query');
                                }else{
                                        tempConn.release();
                                        for (i=0;i<resultado.length; i++){
                                                json1={ "id":resultado[i].id,
                                                        "latitud":resultado[i].latitud,
                                                        "longitud":resultado[i].longitud,
                                                        "gateway":resultado[i].gateway};
                                        console.log(json1);
                                        arreglo.push(json1);
                                        }
                                        res.json(arreglo);
                                }
                        });
                }
        });
});

router.delete('/spinner/:gateway', (req,res) => {
        var gateb=req.params.gateway;
        connection.getConnection(function(error, tempConn){
                if(error){
                        throw error;
                }else{
                        console.log('Conexion correcta.');
                        tempConn.query('DELETE FROM spinner WHERE gateway=?',[gateb], function(error, result){
                                if(error){
                                        throw error;
                                        res.send ("error al ejecutar el query");
                                }else{
                                        tempConn.release();
				        res.send("Gateway "+gateb+"  eliminado");
                                }
                        });
                }
        });
});


router.get('/add/:gateway/:latitud/:longitud', (req,res) => {	
	var lat=req.params.latitud;
        var lon=req.params.longitud;
	var gate=req.params.gateway;
	connection.getConnection(function(error, tempConn){
		if(error){
			throw error;
		}else{
		        console.log('Conexion correcta.');
		        tempConn.query('INSERT INTO spinner VALUES(null,?,?,?)', [lon,lat,gate], function(error, result){
                                if(error){ 
                                        throw error;
                                        res.send ("error al ejecutar el query");
                                }else{
                                        tempConn.release();
                                        res.send("datos almacenados");
                                }
                        });
		}
	});
});

module.exports = router;