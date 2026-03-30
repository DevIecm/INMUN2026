const { response } = require("express");

const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const uuidV4 = require('uuid');
const path = require('path');


const { dbConnection } = require("../database/config");
const { enviarConstanciaMail } = require("../helpers/correos/correo-envia-constancia");
const Usuario = require("../models/usuarios.model");

const generarConstanciasPDF = async (id_usuario, correo_electronico, nombre, curp, nombre_comite, uuid) => {

    const pdfPath = './uploads/templates/reconocimiento.pdf';
    const outputPath = `./uploads/qr/${curp}/constancia-${uuid}.pdf`;
    /* const replacementMap = {
        '{nombre_completo}': 'John Doe',
    }; */


    try {

        // Cargar el archivo PDF
        const templateBytes = await fs.readFileSync(pdfPath);

        // Crear un nuevo documento PDF a partir de la plantilla
        const pdfDoc = await PDFDocument.load(templateBytes);

        // Obtener la primera página del documento
        const page = pdfDoc.getPage(0);

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        let fontSizeNombre = 35;
        let fontSizeComite = 35;
        let fontSizeFecha = 16;

        // Definir las variables que deseas insertar en el PDF
        // const nombre = 'Desireé María de Jesús Rodríguez Ramírez';
        // const nombre = 'Leonardo Daniel Rea Martínez';
        const comite = nombre_comite;
        // const comite = 'Organización Internacional para las Migraciones';
        // const dias_asistencia = [10, 20, 30];
        const formattedString = await formatNumbersWithCommas( id_usuario );
        // const formattedString = await formatNumbersWithCommas(2);
        // console.log(nombre.substring());
        // const spacesCount = nombre.split(' ').length - 1;
        // console.log({spacesCount});
        const longitud_nombre = nombre.length;
        const longitud_comite = comite.length;
        // const longitud_fechas = formattedString.length;
        (longitud_nombre >= 30 ? fontSizeNombre = 25 : fontSizeNombre = fontSizeNombre);
        (longitud_comite >= 48 ? fontSizeComite = 25 : fontSizeComite = fontSizeComite);
        // console.log({ longitud_nombre, longitud_comite });
        const textWidthNombre = font.widthOfTextAtSize(nombre, fontSizeNombre);
        const textWidthComite = font.widthOfTextAtSize(comite, fontSizeComite);
        const textWidthFecha = font.widthOfTextAtSize(formattedString, fontSizeFecha);

        const pageWidth = page.getWidth();
        const centerXNombre = (pageWidth - textWidthNombre) / 2;
        const centerXComite = (pageWidth - textWidthComite) / 2;
        const centerXFecha = (pageWidth - textWidthFecha) / 2;


        // const centerY = page.getHeight() / 2;

        // Rellenar el PDF con las variables
        page.drawText(nombre, { x: centerXNombre, y: 340, size: fontSizeNombre, color: rgb(0, 0, 0) });
        page.drawText(comite, { x: centerXComite, y: 230, size: fontSizeComite });
        // page.drawText(formattedString, { x: centerXFecha, y: 154, size: fontSizeFecha, color: rgb(.57, .52, .57) });
        // drawTextWithAutoBreak(page, nombre, centerXNombre, 340, 300, fontSizeNombre, font);

        // Guardar el documento PDF con los cambios
        const modifiedPdfBytes = await pdfDoc.save();

        // Guardar el PDF modificado en un archivo
        fs.writeFileSync(outputPath, modifiedPdfBytes);

        // console.log('PASAAAAAAAAAAAAAAAAAAAAAAAAAA');

        return true;
        
    } catch (error) {
        console.log(error);
        return false;
    }
}

const generarConstancias  = async (req, res = response) =>  {

    const obtenerUsuariosGenenarConstancia = await dbConnection.query(`SELECT id_usuario, correo_electronico, CONCAT(nombres, ' ', primer_apellido, ' ', ' ', segundo_apellido) AS nombre, curp, nombre_comite, uuid FROM usuarios AS usr INNER JOIN comites AS com ON (usr.id_comite = com.id_comite) WHERE id_usuario IN ( SELECT id_usuario /*, COUNT(*) AS RecuentoFilas*/ FROM asistencias WHERE estado = 1 GROUP BY id_usuario HAVING COUNT(*) >= 1 )`);

    // console.log(obtenerUsuariosGenenarConstancia);
    if (!obtenerUsuariosGenenarConstancia) {
        throw new Error('No se pudo ejecutar el query');
    }

    const getUsuarios = obtenerUsuariosGenenarConstancia[0];
    const aGenerar = getUsuarios.length;

    let generados = 0;
    getUsuarios.forEach( (usr) => {
        // console.log(usr);
        const generado = generarConstanciasPDF(usr.id_usuario, usr.correo_electronico, usr.nombre, usr.curp, usr.nombre_comite, usr.uuid);
        // console.log({generado});
        if(generado){
            generados++;
        }
        console.log({generados});
    });

    // const ejecutaGeneracion = generarConstanciasPDF()

    res.send({
        ok: true,
        // getUsuarios
        aGenerar,
        generados
    });
}

const enviarConstancias = async (req, res = response) => {
    // enviarConstanciaMail
    
    const obtenerUsuariosGenenarConstancia = await dbConnection.query(`SELECT id_usuario, correo_electronico, CONCAT(nombres, ' ', primer_apellido, ' ', ' ', segundo_apellido) AS nombre, curp, nombre_comite, uuid FROM usuarios AS usr INNER JOIN comites AS com ON (usr.id_comite = com.id_comite) WHERE id_usuario IN ( SELECT id_usuario /*, COUNT(*) AS RecuentoFilas*/ FROM asistencias WHERE estado = 1 GROUP BY id_usuario HAVING COUNT(*) >= 1 )`);

    // console.log(obtenerUsuariosGenenarConstancia);
    if (!obtenerUsuariosGenenarConstancia) {
        throw new Error('No se pudo ejecutar el query');
    }

    const getUsuarios = obtenerUsuariosGenenarConstancia[0];
    const aEnviar = getUsuarios.length;

    // let enviados = 0;

    const enviados = await enviarConstanciaMail(getUsuarios);
    // const enviados = enviarConstanciaMail(usr.id_usuario, usr.correo_electronico, usr.nombre, usr.curp, usr.nombre_comite, usr.uuid);
    // console.log({enviados});
    // if(enviados){
        // enviados++;
    // }
    console.log({enviados});
    /* getUsuarios.forEach( (usr) => {
        // console.log(usr);
        // setTimeout(() => {
        // }, 1000);
    }); */

    // const ejecutaGeneracion = generarConstanciasPDF()

    res.send({
        ok: true,
        // getUsuarios,
        aEnviar,
        enviados
    });
}



const testConstanciasPost = async (req, res = response) => {
    res.send({
        ok: true,
        msg: 'Constancias works!'
    });
}

async function drawTextWithAutoBreak(page, text, x, y, maxWidth, fontSize, font) {
    const lines = [];
    let currentLine = '';

    for (const word of text.split(' ')) {
        const wordWidth = font.widthOfTextAtSize(word, fontSize);
        if (font.widthOfTextAtSize(currentLine + ' ' + word, fontSize) <= maxWidth) {
            currentLine += (currentLine === '' ? '' : ' ') + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const yOffset = y - (i * fontSize * 1.2); // Adjust the line spacing as desired

        page.drawText(line, {
            x: x,
            y: yOffset,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
        });
    }
}

const formatNumbersWithCommas = async (id_usuario) => {

    // id_usuario = 2;

    const diasDBAsistencia = await dbConnection.query(`SELECT fecha, SUBSTRING(fecha, 9, 2) AS dia FROM fechas_comites WHERE id_fecha IN ( SELECT id_fecha FROM asistencias WHERE id_usuario = ${id_usuario} AND estado = 1 )`);

    // console.log(diasDBAsistencia);
    if (!diasDBAsistencia) {
        throw new Error('No se pudo ejecutar el query');
    }

    const getDias = diasDBAsistencia[0];
    const numbers = [];
    getDias.forEach((row) => {
        // console.log(row);
        numbers.push(row.dia)
    })
    // console.log(getDias);

    if (!Array.isArray(numbers)) {
        throw new Error('Input is not an array');
    }

    if (numbers.length === 0) {
        return '';
    }

    const formattedNumbers = numbers.slice(0, numbers.length - 1).join(', ');
    const lastNumber = numbers[numbers.length - 1];

    return `durante los días ${formattedNumbers}  y ${lastNumber} de junio de 2023`;
}

const obtenerConstancia = async (req, res = response) => {

    const { id_usuario, uuid } = req.params;
    // const uuidOK = uuidv4().validate( uuid );
    const uuidOK = uuidV4.validate( uuid );

    if(!uuidOK){
        return res.status(501).send({
            ok: false,
            msg: 'La información recibida no es válida. Hable con el administrador'
        });
    }

    const usrDB = await Usuario.findOne({ where: { uuid, id_usuario, estado: 5 } });

    if(!usrDB){
        return res.status(501).send({
            ok: false,
            msg: 'No se encontró información relacionada a los parámetros recibidos. Hable con el administrador'
        });
    }

    const { curp } = usrDB;

    const path_constancia = path.join(__dirname, `../uploads/qr/${curp}/constancia-${uuid}.pdf`);

    if (!fs.existsSync(path_constancia)) {
        res.status(400).json({
            ok: false,
            msg: 'No se encontró imagen con dicho nombre'
        });
    }


    res.download(path_constancia);
}

module.exports = {
    testConstanciasPost,
    generarConstancias,
    enviarConstancias,
    obtenerConstancia
}