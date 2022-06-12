CREATE TABLE Empleado (
    EmpleadoID int identity(0,1) primary key,
    Nombre varchar(255) NOT NULL,
    Correo varchar(255),
);

create table Proyecto(
	ProyectoID int identity(0,1) primary key,
	Nombre varchar(255) NOT NULL,
	Lider int FOREIGN KEY REFERENCES empleado,
)

create table Trabaja_En(
	ProyectoID int FOREIGN KEY REFERENCES proyecto,
	EmpleadoID int FOREIGN KEY REFERENCES empleado,
	Horas Float,
)

create table Evaluacion(
    TipoEvaluacion int PRIMARY KEY,
    EvaluacionNombre varchar(255),
)

INSERT INTO Evaluacion(TipoEvaluacion, EvaluacionNombre) 
VALUES 
(0,'Peer to Peer'),
(1,'Lider a Equipo'),
(2, 'Equipo a Lider');

create table EstatusEvaluacion(
    id int primary key,
    estatusnombre varchar(255),
)

INSERT INTO EstatusEvaluacion(id, estatusnombre) 
VALUES 
(-1,'Sin Publicar'),
(0,'Pendiente'),
(1,'Validado'),
(2, 'Reporte');

create table EvaluaA(
    EvaluacionID int identity(0,1) primary key,
    EmpleadoA int FOREIGN KEY REFERENCES empleado,
    TipoEvaluacion int FOREIGN KEY REFERENCES evaluacion,
    EmpleadoB int FOREIGN KEY REFERENCES empleado,
    Estatus int FOREIGN KEY REFERENCES EstatusEvaluacion
)

create table Reportes(
    EvaluacionID int FOREIGN KEY REFERENCES EvaluaA,
    Reporte VARCHAR(500),
)

create table Administradores(
    Nombre VARCHAR(255),
    Correo VARCHAR(255),
)

SELECT CASE
    WHEN NOT EXISTS(SELECT *
                    FROM   EvaluaA
                    WHERE  Estatus <> -1) THEN 'false'
    ELSE 'true'
END AS ifValidando

select * from EvaluaA


UPDATE EvaluaA
SET Estatus = -1


SELECT CASE WHEN EXISTS (
    SELECT *
    FROM EvaluaA
)
THEN CAST(1 AS BIT)
ELSE CAST(0 AS BIT) END

SELECT DISTINCT EmpA.nombre, EvaluacionNombre, EmpB.Nombre,estatus from EvaluaA
JOIN Empleado EmpA ON EvaluaA.EmpleadoA  = EmpA.EmpleadoID
JOIN Empleado EmpB ON EvaluaA.EmpleadoB  = EmpB.EmpleadoID
JOIN Evaluacion ON EvaluaA.TipoEvaluacion = Evaluacion.TipoEvaluacion

UPDATE EvaluaA
SET estatus = 1
WHERE EmpleadoA = 182 AND TipoEvaluacion = 0 AND EmpleadoB = 199;

UPDATE EvaluaA
SET estatus = 2
WHERE EmpleadoA = 182 AND TipoEvaluacion = 0 AND EmpleadoB = 208;

SELECT CASE WHEN EXISTS (
            SELECT *
            FROM EvaluaA
        )
        THEN CAST(1 AS BIT)
        ELSE CAST(0 AS BIT) END

SELECT Empleado.Nombre, Proyecto.Nombre
FROM Trabaja_En
JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
JOIN Empleado ON Trabaja_En.EmpleadoID = Empleado.EmpleadoID
where Empleado.Nombre in (SELECT distinct nombre FROM Empleado
WHERE nombre NOT in (SELECT DISTINCT EmpA.Nombre from EvaluaA
            JOIN Empleado EmpA ON EvaluaA.EmpleadoA  = EmpA.EmpleadoID))



select DISTINCT Nombre,EvaluacionNombre from EvaluaA 
JOIN Empleado ON EvaluaA.EmpleadoB  = Empleado.EmpleadoID
JOIN Evaluacion ON EvaluaA.TipoEvaluacion = Evaluacion.TipoEvaluacion
where EmpleadoA = (select EmpleadoID from Empleado where Nombre = 'Alfredo Martinez')



SELECT * from  Evaluacion

select * from EvaluaA


SELECT Empleado.Nombre,Proyecto.Nombre,Horas
FROM Trabaja_En
JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
JOIN Empleado ON Trabaja_En.EmpleadoID = Empleado.EmpleadoID
WHERE Proyecto.Nombre = 'ACP - Coursetune' and Horas > 50


select * from Trabaja_En

SELECT Proyecto.Nombre
FROM Trabaja_En
JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
JOIN Empleado ON Trabaja_En.EmpleadoID = Empleado.EmpleadoID
WHERE Empleado.Nombre = 'Castro Estrada, Alberto' and Horas > 50


SELECT Empleado.Nombre
FROM Proyecto 
JOIN Empleado ON Proyecto.Lider = Empleado.EmpleadoID
WHERE Proyecto.Nombre = 'ACP - Coursetune'


If Not Exists(select * from Trabaja_En where ProyectoID= 0 and EmpleadoID = 2 and Horas = 569)
            Begin
            insert into trabaja_en(ProyectoID,EmpleadoID,Horas) values (0,2,569)
            End

select * from trabaja_en

insert into proyecto(Nombre,Lider) values ('NombreEquis',1)

select empleadoid from empleado where nombre = 'Castro Estrada, Alberto'
select * from Empleado

select * from evaluacion


select * from Proyecto 


select ProyectoID from Proyecto where Nombre = 'ACP - Coursetune'

select * from Empleado 

select * from Empleado where Nombre = 'Pablo Nuñez'

insert into empleado (nombre) values ('Nickyjam')


If Not Exists(select * from proyecto where nombre='Proyecto1' or Lider = 7 )
            Begin
            insert into proyecto (nombre,Lider) values ('Proyecto1',7)
            End

If Not Exists(select * from EvaluaA where Empleado='${empleadoa}' or Lider = 7 )
            Begin
            insert into proyecto (nombre,Lider) values ('Proyecto1',7)
            End




SELECT CASE WHEN EXISTS (
            SELECT *
            FROM EvaluaA
        )
        THEN CAST(1 AS BIT)
        ELSE CAST(0 AS BIT) END


delete EvaluaA 
delete Trabaja_En 
delete Proyecto 
delete Reportes
DBCC CHECKIDENT ('Proyecto', RESEED, 0); 
GO 
delete Empleado 
DBCC CHECKIDENT ('Empleado', RESEED, 0); 
GO 
DBCC CHECKIDENT ('EvaluaA', RESEED, 0); 
GO 
Insert into Empleado(Nombre,Correo) values('EmpleadoNoRegistrado','N/A')

--PARA INSERTAR DE EMPLEADO MI CORREO
delete Empleado WHERE EmpleadoID = 242


INSERT into Administradores(Nombre,Correo) values('AA Nicolas Cardenas','A01114959@tec.mx')
delete Administradores

select ProyectoID, Proyecto.Nombre, Empleado.Nombre as Lider from Proyecto left Join Empleado on Lider = Empleado.EmpleadoID


        SELECT EmpHuerfano.Nombre AS Nombre, Proyecto.Nombre AS Proyecto, EmpLider.Nombre AS Lider
        FROM Trabaja_En
        JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
        JOIN Empleado EmpHuerfano ON Trabaja_En.EmpleadoID = EmpHuerfano.EmpleadoID
        join Empleado EmpLider ON Proyecto.Lider = EmpLider.EmpleadoID

select * from EvaluaA
select * from Trabaja_En

Insert into EvaluaA(EmpleadoA,TipoEvaluacion,EmpleadoB,Estatus) values(4,0,4,0)
Insert into EvaluaA(EmpleadoA,TipoEvaluacion,EmpleadoB,Estatus) values(4,1,5,0)
Insert into EvaluaA(EmpleadoA,TipoEvaluacion,EmpleadoB,Estatus) values(4,2,7,0)
Insert into EvaluaA(EmpleadoA,TipoEvaluacion,EmpleadoB,Estatus) values(4,0,9,0)
Insert into EvaluaA(EmpleadoA,TipoEvaluacion,EmpleadoB,Estatus) values(4,0,20,0)

update evaluaa set estatus = 0
select * from Reportes

update Empleado SET Correo = 'A01114959@tec.mx' where EmpleadoID = 4

INSERT INTO Administradores values('AA Luis','A00827678@tec.mx')
update EvaluaA set Estatus = 0
delete Administradores where correo = 'A01114959@tec.mx'


select * from Empleado

update empleado set correo = 'A01114959@tec.mx' where empleadoid=182

update EvaluaA set Estatus=0
delete reportes


select COUNT(*) from Administradores where Correo = 'A01114959@tec.mx'

        SELECT EmpHuerfano.Nombre AS Nombre, Proyecto.Nombre AS Proyecto, EmpLider.Nombre AS Lider
        FROM Trabaja_En
        JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
        JOIN Empleado EmpHuerfano ON Trabaja_En.EmpleadoID = EmpHuerfano.EmpleadoID
        join Empleado EmpLider ON Proyecto.Lider = EmpLider.EmpleadoID
        where EmpHuerfano.Nombre in (SELECT distinct nombre FROM Empleado
        WHERE nombre NOT in (SELECT DISTINCT EmpA.Nombre from EvaluaA
                                JOIN Empleado EmpA ON EvaluaA.EmpleadoA  = EmpA.EmpleadoID))

select * from evalua where 

select * from EvaluaA 
Join Empleado EmpB on EvaluaA.EmpleadoB

update evaluaa set Estatus = 0

select * from Reportes

DELETE FROM Reportes WHERE EvaluacionID = (Select EvaluacionID from EvaluaA where EvaluaA.EmpleadoA = 182 AND TipoEvaluacion = 1 AND EmpleadoB = 186)
DELETE FROM Reportes WHERE EvaluacionID = (Select EvaluacionID from EvaluaA where EvaluaA.EmpleadoA = 186 AND TipoEvaluacion = 2 AND EmpleadoB = 182)
DELETE FROM EvaluaA WHERE (EmpleadoA = 182 AND TipoEvaluacion = 1 AND EmpleadoB = 186) OR (EmpleadoA = 186 AND TipoEvaluacion = 2 AND EmpleadoB = 182);

where EmpleadoA = (select EmpleadoID from Empleado where Correo = 'A01114959@tec.mx')


select * from Empleado



select * from EvaluaA


        delete EvaluaA
        delete Trabaja_En
        delete Proyecto
        delete Reportes
        DBCC CHECKIDENT ('Proyecto', RESEED, 0);
        delete Empleado
        DBCC CHECKIDENT ('Empleado', RESEED, 0);
        DBCC CHECKIDENT ('EvaluaA', RESEED, 0); 
        insert into Empleado(Nombre,Correo) values('EmpleadoNoRegistrado','N/A')



        select EmpleadoA as EmpleadoAID,EmpA.Nombre as EmpleadoANombre, EmpB.EmpleadoID as EmpleadoBID, EmpB.Nombre as EmpleadoBNombre, Evaluacion.EvaluacionNombre as TipoEvaluacion from EvaluaA 
        Join Empleado EmpB on EvaluaA.EmpleadoB = EmpB.EmpleadoID
        Join Empleado EmpA on EvaluaA.EmpleadoA = EmpA.EmpleadoID
        Join Evaluacion on EvaluaA.TipoEvaluacion = Evaluacion.TipoEvaluacion
        where EmpleadoA = (select EmpleadoID from Empleado where Correo = 'A01114959@tec.mx') AND Estatus = 0

SELECT DISTINCT EmpA.nombre, EvaluacionNombre, EmpB.Nombre, estatus, Rep.Reporte from EvaluaA
        JOIN Empleado EmpA ON EvaluaA.EmpleadoA  = EmpA.EmpleadoID
        JOIN Empleado EmpB ON EvaluaA.EmpleadoB  = EmpB.EmpleadoID
        LEFT JOIN Reportes Rep ON EvaluaA.EvaluacionID = Rep.EvaluacionID
        JOIN Evaluacion ON EvaluaA.TipoEvaluacion = Evaluacion.TipoEvaluacion

        

delete EvaluaA
        delete Trabaja_En
        delete Proyecto
        delete Reportes
        delete Empleado
        DBCC CHECKIDENT ('Proyecto', RESEED, 0);
        DBCC CHECKIDENT ('Empleado', RESEED, 0);
        DBCC CHECKIDENT ('EvaluaA', RESEED, 0);
        insert into Empleado(Nombre,Correo) values('EmpleadoNoRegistrado','N/A')