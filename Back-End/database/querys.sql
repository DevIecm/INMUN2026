SELECT * FROM admin
--TRUNCATE TABLE admin


SELECT estado, * FROM usuarios
SELECT * FROM vst_usuarios_informacion_general



--estado 3 no permisos
--estado 4 no tiene asistencias
--UPDATE usuarios SET estado = 4 WHERE id_usuario = 1
--UPDATE usuarios SET estado = 3 WHERE id_usuario = 1
--UPDATE usuarios SET correo_electronico='16020129@alumnos.icel.edu.mx' WHERE id_usuario = 2

--UPDATE usuarios SET actualiza_contrasena = 0 WHERE id_usuario = 1


SELECT * FROM comites
SELECT * FROM asistencias
--UPDATE comites SET lugares_disponibles = 19 WHERE id_comite = 1
--19
--UPDATE comites SET lugares_disponibles = 24 WHERE id_comite = 1
SELECT * FROM permisos_autorizaciones

--DELETE FROM permisos_autorizaciones WHERE id_usuario = 2

SELECT * FROM comites WHERE id_comite = 3
SELECT * FROM fechas_comites WHERe id_comite = 3

SELECT * FROM asistencias

SELECT * FROM cat_estados_republica


-- Inicializar sistema
/*
TRUNCATE TABLE usuarios
GO
TRUNCATE TABLE comites
GO
TRUNCATE TABLE fechas_comites
GO
TRUNCATE TABLE asistencias
GO
TRUNCATE TABLE permisos_autorizaciones
GO
TRUNCATE TABLE [dbo].[usuarios_eliminados]
GO
*/

-- Para saber la relacion usuarios-comités
SELECT id_comite, COUNT(*) AS total FROM usuarios WHERE estado >= 4 GROUP BY id_comite
SELECT id_comite, cupo, lugares_disponibles FROM comites WHERE estado = 1

--EXEC sp_asistencia 2, 1, 1, 1

--EXEC sp_asistencia 2, 2, 1, 0
-- @id_comite, @id_usuario, @id_admin, @tipo_consulta = 0 INS | 1 UPD quitar asistencia
SELECT * FROM asistencias


SELECT * FROM fechas_comites WHERE id_comite = 1


SELECT * FROM asistencias

--delete from asistencias WHERE id_asistencia = 3


SELECT COUNT(*) AS existe FROM fechas_comites WHERE estado = 1 AND id_comite = 1 AND format(convert(datetime, fecha), 'yyyy/MM/dd') IN (SELECT format(convert(datetime, getdate()), 'yyyy/MM/dd'))



SELECT fecha FROM fechas_comites WHERE estado = 1 AND id_comite = 1
SELECT format(convert(datetime, getdate()), 'yyyy/MM/dd')
