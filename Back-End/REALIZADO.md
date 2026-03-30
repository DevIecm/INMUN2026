# INMUN

## Modelo de Naciones Unidad

Coadyuvar a la divulgación de la cultura democrática, a través de la generación de espacios para la puesta en práctica de ideas, reflexiones y aportaciones en torno a la participación ciudadana y los temas que le son afines. 
El sistema será un insumo para el registro de las personas que participen en el Modelo de Naciones Unidas del Instituto Electoral de la Ciudad de México (INMUN 2023).

## 28 y 29 de marzo del 2023

- Se modifica mensaje referente a autenticación inconrrecta
- Activar cuenta se cambia de usuario a uuid

- Auth.controller
    - Se valida que al solicitar cambiar la contraseña se tenga un estado mayor a 0 para indicar que se hace para garantizar recepción de correos
    
- qr.controller
    - Se reduce el tiempo de proomesa a 500
    
- usuarios.controller
    - Se valida disponibilidad en comite al permisosYAutorizaciones (retorna a estado 2 si ya no hay cupo) y suscribirAComite

- jwt.js se reduce diración de jwt a 15 minutos

- usuarios-eliminados.js
    - Agregar campo de cual_discapacidad


**Pendientes**

- Envío de constancias

# Ayudas

SELECT FORMAT(CONVERT(date, GETDATE(), 103), 'yyyy/MM/dd') AS HOY

--SELECT CAST('1998-08-26' as date) AS fecha_nacimiento

SELECT FORMAT(CAST('1998-08-26' as date), 'yyyy/MM/dd') AS fecha_nacimiento