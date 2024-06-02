const dataModel = require('../models/dataModel');

exports.getData = (req, res) => {
    // Logica per ottenere i dati
    const data = dataModel.getData();
    res.json(data);
};
    
exports.createData = (req, res) => {
    // Logica per creare nuovi dati
    const newData = req.body;
    dataModel.addData(newData);
    res.send('Dati creati con successo');
};
