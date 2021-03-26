create database dragino;
use dragino

create table datos (
id int auto_increment,
longitud DEC(20,15),
latitud DEC(20,15),
altitud DEC(20,15),
rssi INT(20),
snr INT(20),
frecuencia INT(20),
gateway varchar(255),
fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
primary key(id));

create table spinner (
id int auto_increment,
longitud DEC(20,15),
latitud DEC(20,15),
gateway varchar(255),
primary key(id));

SET @@session.time_zone = "-05:00";

INSERT INTO datos VALUES(null, -76.522377, 3.353807, 1017.60, -47, 10, 868, "UAO", null);
INSERT INTO spinner VALUES(null, -76.522469270888270, 3.353696245950556,"UAO");
