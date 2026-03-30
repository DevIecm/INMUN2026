const { response } = require("express");

const excelJS = require('exceljs');
const { dbConnection } = require("../database/config");

const fs = require('fs');
const path = require('path');
const Alcaldias = require("../models/alcaldias");
const EstadosRepublica = require("../models/estados-republica-mexicana");

const rptRegistros = async (req, res = response ) => {
    const nombre_reporte = `reporte_registro_usuarios.xlsx`;
    const pathFile = "./reports";  // Path to download excel

    const workbook = new excelJS.Workbook();  // Create a new workbook
    const worksheet = workbook.addWorksheet('Información general', {
        views: [{
            activeCell: 'A1',
            showGridLines: false
        }]
    }); // New Worksheet

    const worksheet_2 = workbook.addWorksheet('Asistencia', {
        views: [{
            activeCell: 'A1',
            showGridLines: false
        }]
    }); // New Worksheet
    
    worksheet.columns = [
        // { header: "id_usuario", key: "nombre_candidatx", width: 30 },
        { header: 'Estado', key: 'estado', width: 30 },
        { header: 'Comité en que se registró', key: 'nombre_comite', width: 30 },
        { header: 'Nombre completo', key: 'nombres', width: 30 },
        { header: 'Primer apellido', key: 'primer_apellido', width: 30 },
        { header: 'Segundo apellido', key: 'segundo_apellido', width: 30 },
        { header: 'Sexo', key: 'genero', width: 30 },
        { header: 'Edad', key: 'edad', width: 30 },
        { header: 'Correo electrónico', key: 'correo_electronico', width: 30 },
        { header: 'CURP', key: 'curp', width: 30 },
        { header: 'Teléfono celular', key: 'telefono_celular', width: 30 },
        { header: 'Teléfono de casa', key: 'telefono_casa', width: 30 },
        { header: 'Demarcación territorial', key: 'demarcacion_territorial', width: 30 },
        { header: 'Entidad federativa', key: 'entidad_federativa', width: 30 },
        { header: 'Cómo te enteraste del INMUN', key: 'como_te_enteraste', width: 30 },
        // { header: 'Persona con discapacidad', key: 'discapacidad', width: 30 },
        // { header: '¿Cuál?', key: 'cual_discapacidad', width: 30 },
        { header: 'Términos establecidos en la convocatoria', key: 'conoce_acepta_terminos_convocatoria', width: 30 },
        { header: 'Aviso de privacidad', key: 'ha_leido_aviso_privacidad', width: 30 },
        { header: 'Uso de imagen', key: 'autoriza_uso_imagen', width: 30 },
        { header: 'Menores de 18 años', key: 'menor_edad', width: 30 },
        { header: 'Nombre madre, padre o persona tutora', key: 'nombre_tutor', width: 40 },
        { header: 'Clave de elector de madre, padre o persona tutora', key: 'curp_tutor', width: 40 }
    ];
    
    worksheet_2.columns = [
        { header: "# asistencia", key: "id_asistencia", width: 30 },
        { header: 'Nombre completo', key: 'nombres', width: 30 },
        { header: 'Primer apellido', key: 'primer_apellido', width: 30 },
        { header: 'Segundo apellido', key: 'segundo_apellido', width: 30 },
        { header: 'Comité en que se registró', key: 'nombre_comite', width: 30 },
        { header: 'Fecha asistencia', key: 'fecha_alta', width: 30 },
        { header: 'Usuario que tomó asistencia', key: 'nombre_usuario', width: 40 }
    ];


    // QUERY
    const query_registros = `SELECT * FROM vst_usuarios_informacion_general;`;

    const exe_query_registros = await dbConnection.query(query_registros);
    if (!exe_query_registros) {
        return res.status(401).json({
            ok: false,
            msg: 'Ocurrió un error en la consulta'
        });
    }
    
    // Cargar alcaldías
    const alcaldiasDB = await Alcaldias.findAll({ attributes: [ 'id_alcaldia', 'nombre_alcaldia' ]  });
    // console.log(alcaldiasDB);
    let arrAlcaldia = [];
    arrAlcaldia.unshift( {id_alcaldia: 1, nombre_alcaldia: 'Fuera de la Ciudad de México'} );
    alcaldiasDB.forEach( (opcion) => {
        arrAlcaldia.push(opcion.dataValues);
    });
    
    // cargar estados de la república mexicana
    const edosRepublicaDB = await EstadosRepublica.findAll({ attributes: [ 'id_estado', 'nombre' ]  });
    // console.log(edosRepublicaDB);
    let arrEstados = [];
    edosRepublicaDB.forEach( (opcion) => {
        // genero --
        // demarcacion_territorial -- **
        // entidad_federativa -- **
        // como_te_enteraste -- **
        // discapacidad -- **
        arrEstados.push(opcion.dataValues);
    });

    // console.log(exe_query_registros[0]);

    const data_tabla = exe_query_registros[0];

    data_tabla.forEach((dataRow) => {
        // dataRow.s_no = counter;
        // dataRow.votos_obtenidos = Number(dataRow.votos_obtenidos);
        
        // if(dataRow.estado > 1)
        // console.log({discapacidad: dataRow.discapacidad});

        
        dataRow.genero = getGenero( dataRow.genero );

        if(dataRow.estado >= 2){
            // console.log('ENtraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
            // ( dataRow.discapacidad ? dataRow.discapacidad = 'Si' : dataRow.discapacidad = 'No' );
            dataRow.demarcacion_territorial = getAlcaldiaSeleccionada( arrAlcaldia, dataRow.demarcacion_territorial );
            dataRow.entidad_federativa = getEntidadFederativaSeleccionada( arrEstados, dataRow.entidad_federativa );
            dataRow.como_te_enteraste = getComoSeEntera( dataRow.como_te_enteraste );
        }
        
        if(dataRow.estado === 0){
            dataRow.estado = 'Registrado'
        }
        if(dataRow.estado === 1){
            dataRow.estado = 'Cuenta activada'
        }
        if(dataRow.estado === 2){
            dataRow.estado = 'Complementó información'
        }
        if(dataRow.estado === 3){
            dataRow.estado = 'Seleccionó comité'
        }
        if(dataRow.estado === 4){
            dataRow.estado = 'Aceptó términos'
        }
        if(dataRow.estado === 5){
            dataRow.estado = 'Con asistencia(s)'
        }
        
        console.log(dataRow);
        worksheet.addRow(dataRow); // Add data in worksheet
    });

    // Making first line in excel bold
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });

    var borderStyles = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
    };

    worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {

        row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
            cell.border = borderStyles;
            cell.alignment = { vertical: 'middle', horizontal: 'center' }
        });

    });
    
    // QUERY
    const query_asistencia = `SELECT * FROM vst_relacion_usuario_asistencia;`;

    const exe_query_asistencia = await dbConnection.query(query_asistencia);
    if (!exe_query_asistencia) {
        return res.status(401).json({
            ok: false,
            msg: 'Ocurrió un error en la consulta'
        });
    }

    // console.log(exe_query_asistencia[0]);

    const data_tabla_asistencias = exe_query_asistencia[0];

    data_tabla_asistencias.forEach((dataRow) => {
        // dataRow.s_no = counter;
        // dataRow.votos_obtenidos = Number(dataRow.votos_obtenidos);
        worksheet_2.addRow(dataRow); // Add data in worksheet_2
    });

    // Making first line in excel bold
    worksheet_2.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });

    var borderStyles = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
    };

    worksheet_2.eachRow({ includeEmpty: true }, function (row, rowNumber) {

        row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
            cell.border = borderStyles;
            cell.alignment = { vertical: 'middle', horizontal: 'center' }
        });

    });

    try {

        const data = await workbook.xlsx.writeFile(`${pathFile}/${nombre_reporte}`)
            .then(() => {

                const pathImg = path.join(__dirname, `../${pathFile}/${nombre_reporte}`);

                if (fs.existsSync(pathImg)) {

                    console.log('file is written');

                    var host = req.headers.host;
                    // var origin = req.headers.origin;
                    res.send({
                        ok: true,
                        msg: 'Descargarlo',
                        reporte: `${host}/api/admin-reportes/descargar-reporte/${nombre_reporte}`
                    });
                    // res.download( pathImg );

                } else {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No se encontró el archivo generado'
                    });
                }

            });


    } catch (error) {

        res.status(500).send({
            ok: false,
            msg: 'Ocurrió un error',
            error
        });

    }

}

const descargarReporte = async (req, res = response) => {
    const nombre_reporte = req.params.nombre_reporte;
    // const foto = req.params.foto;
    if (!nombre_reporte) {
        res.status(401).json({
            ok: false,
            msg: 'Es necesario mandar un nombre de archivo'
        });
    }

    const pathImg = path.join(__dirname, `../reports/${nombre_reporte}`);

    if (fs.existsSync(pathImg)) {
        res.download(pathImg);
    } else {
        res.status(400).json({
            ok: false,
            msg: 'No se encontró imagen con dicho nombre'
        });
    }
}

const getAlcaldiaSeleccionada = (arrAlcaldia, alcaldiaSelected) => {
    // console.log({alcaldiaSelected});
    // console.log(arrAlcaldia);
    const found = arrAlcaldia.find( o => o.id_alcaldia === alcaldiaSelected);

    if(found){
        return found.nombre_alcaldia;
    } else{
        return '';
    }

}

const getEntidadFederativaSeleccionada = (arrEdos, entidad_federativa) => {
    // console.log({opcionSelected});

    const found = arrEdos.find( o => o.id_estado === entidad_federativa);

    if( found ){

        return found.nombre;
    } else{
        return 'No aplica';
    }

}

const getComoSeEntera = (como_te_enteraste) => {
    // console.log({opcionSelected});

    const entera = [
        { value: 1, label: 'Página de internet del IECM' },
        { value: 2, label: 'Redes sociales' },
        { value: 3, label: 'Escuela' },
        { value: 4, label: 'Amigos/Familiar' },
    ];

    const found = entera.find( o => o.value === como_te_enteraste);

    if( found ){

        return found.label;

    } else{
        return '';
    }

}

const getGenero = (genero) => {
    // console.log({opcionSelected});

    const selGenero = [
        { genero: 1, descripcion_genero: 'Mujer' },
        { genero: 2, descripcion_genero: 'Hombre' },
        { genero: 3, descripcion_genero: 'Prefiero no decirlo' },
    ];

    const found = selGenero.find( o => o.genero === genero);

    if( found ){

        return found.descripcion_genero;

    } else{
        return '';
    }

}


module.exports = {
    rptRegistros,
    descargarReporte
}