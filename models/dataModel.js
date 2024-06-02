// Esempio di modello dei dati
let data = [];

exports.getData = () => {
    return data;
};

exports.addData = (newData) => {
    data.push(newData);
};
