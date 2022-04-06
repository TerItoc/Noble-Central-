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

create table EvaluaA(
    EmpleadoA int FOREIGN KEY REFERENCES empleado,
    TipoEvaluacion int FOREIGN KEY REFERENCES evaluacion,
    EmpleadoB int FOREIGN KEY REFERENCES empleado,
)

select * from EvaluaA


select DISTINCT Nombre,EvaluacionNombre from EvaluaA 
JOIN Empleado ON EvaluaA.EmpleadoB  = Empleado.EmpleadoID
JOIN Evaluacion ON EvaluaA.TipoEvaluacion = Evaluacion.TipoEvaluacion
where EmpleadoA = 0





SELECT Empleado.Nombre, Proyecto.Nombre, Horas
FROM Trabaja_En
JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
JOIN Empleado ON Trabaja_En.EmpleadoID = Empleado.EmpleadoID

SELECT Empleado.Nombre,Proyecto.Nombre,Horas
FROM Trabaja_En
JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
JOIN Empleado ON Trabaja_En.EmpleadoID = Empleado.EmpleadoID
WHERE Proyecto.Nombre = 'ACP - Coursetune' and Horas > 50

SELECT Proyecto.Nombre
FROM Trabaja_En
JOIN Proyecto ON Trabaja_En.ProyectoID = Proyecto.ProyectoID
JOIN Empleado ON Trabaja_En.EmpleadoID = Empleado.EmpleadoID
WHERE Empleado.Nombre = 'Castro Estrada, Alberto' and Horas > 50


SELECT Empleado.Nombre
FROM Proyecto 
JOIN Empleado ON Proyecto.Lider = Empleado.EmpleadoID
WHERE Proyecto.Nombre = 'ACP - Coursetune'

            
SELECT DISTINCT EmpA.nombre, EvaluacionNombre, EmpB.Nombre from EvaluaA
            JOIN Empleado EmpA ON EvaluaA.EmpleadoA  = EmpA.EmpleadoID
            JOIN Empleado EmpB ON EvaluaA.EmpleadoB  = EmpB.EmpleadoID
            JOIN Evaluacion ON EvaluaA.TipoEvaluacion = Evaluacion.TipoEvaluacion


If Not Exists(select * from Trabaja_En where ProyectoID= 0 and EmpleadoID = 2 and Horas = 569)
            Begin
            insert into trabaja_en(ProyectoID,EmpleadoID,Horas) values (0,2,569)
            End

select * from trabaja_en

insert into proyecto(Nombre,Lider) values ('NombreEquis',1)


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

insert into EvaluaA values 
('Karla Suarez',0,'Arquieta Leal, Diego Alberto'),
('Karla Suarez',0,'Jara Diaz de Leon , Erendira Citlalli'),
('Karla Suarez',2,'Raul Aguilera'),
('Karla Suarez',2,'Aaron Hernandez'),
('Karla Suarez',0,'Alan Vera'),
('Karla Suarez',0,'Castulo Vela'),
('Karla Suarez',0,'Muñiz Reyes, Daniel Alejandro'),
('Karla Suarez',0,'Osorio Plazas, Francisco Javier'),
('Karla Suarez',0,'Zaldivar Estrada, Paulina'),
('Campos Martinez, Ricardo Ismael',0,'Balderas Medina, Gerardo Alberto'),
('Campos Martinez, Ricardo Ismael',0,'Eduardo Muñoz'),
('Campos Martinez, Ricardo Ismael',2,'Jorge Escamilla'),
('Campos Martinez, Ricardo Ismael',0,'Luis Quintero'),
('Karla Suarez',0,'Arquieta Leal, Diego Alberto'),
('Karla Suarez',0,'Jara Diaz de Leon , Erendira Citlalli'),
('Karla Suarez',2,'Raul Aguilera');

--reset db
delete Trabaja_En

--reset db
delete Evaluacion

--reset db
delete Proyecto
DBCC CHECKIDENT ('Proyecto', RESEED, 0);
GO

--reset db
delete Empleado
DBCC CHECKIDENT ('Empleado', RESEED, 0);
GO
insert into Empleado(Nombre,Correo) values('EmpleadoNoRegistrado','N/A')


