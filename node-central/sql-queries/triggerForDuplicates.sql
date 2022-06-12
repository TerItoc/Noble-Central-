CREATE TRIGGER triggerCheckDuplicates
ON Empleado
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON
    IF EXISTS 
    (
        SELECT 1 
        FROM Empleado E 
        INNER JOIN INSERTED I 
        ON E.Nombre = I.Nombre
    )

    BEGIN
        -- Do dupe handling here
        return
    END

    -- actually add it in
    INSERT INTO Empleado(Nombre,Correo) VALUES (I.Nombre,I.Correo)
END
GO