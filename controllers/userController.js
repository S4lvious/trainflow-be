const  { sql, connectDB } = require('../db');
const jwt = require('jsonwebtoken');


exports.userList = async (req, res)  => {
    try {
        await connectDB();
        const request = new sql.Request();
        if (req.query.id_utente) {
            request.input('id_user', sql.Int, req.query.id_utente);
            const result = await request.execute('Gs_user_getchildren');
            await sql.close(); 
            res.json(result.recordset);
        } else {
            request.input('id_user', sql.Int, req.user.id_utente);
            const result = await request.execute('Gs_user_getchildren');
            await sql.close();
            res.json(result.recordset);
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

exports.getUserById = async (req, res)  => {
    try {
        await connectDB();
        const request = new sql.Request();
        console.log(req.params.id);
        request.input('id_utente', sql.Int, req.params.id);
        const result = await request.execute('Gs_user_get');
        await sql.close(); 
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

exports.getGameParametersById = async (req, res)  => {
    try {
        await connectDB();
        const request = new sql.Request();
        console.log(req.params.id_utente, req.params.tipo)
        request.input('id_utente', sql.Int, req.params.id_utente);
        request.input('tipo', sql.Char, req.params.tipo);
        const result = await request.execute('Sel_Parametri_Utenti');
        console.log(result);
        await sql.close();
        res.json(result.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}

exports.getGlobalGameParametersById = async (req, res)  => {
    try {
        await connectDB();
        const request = new sql.Request();
        console.log(req.params.id_utente, req.params.tipo)
        request.input('id_utente', sql.Int, req.params.id_utente);
        const result = await request.execute('Sel_Parametri_Utenti_Globali');
        console.log(result);
        await sql.close();
        res.json(result.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}

exports.getBonusByUserId = async (req, res)  => {
    try {
        await connectDB();
        const request = new sql.Request();
        console.log(req.params.id_utente)
        request.input('id_utente', sql.Int, req.params.id_utente);
        const result = await request.execute('Fd_get_user_bonus');
        console.log(result);
        await sql.close();
        res.json(result.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}


exports.getUserDisabledGames = async (req, res)  => {
    try {
        await connectDB();
        const request = new sql.Request();
        console.log(req.params.id_utente)
        request.input('id_user', sql.Int, req.params.id_utente);
        const result = await request.execute('FD_Get_Utenti_games_disabled ');
        console.log(result);
        await sql.close();
        res.json(result.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}

