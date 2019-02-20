var clients = [
    { 'nome': 'Joao da Silva', 'documento': '123456789', 'telefone': '123456789' },
    { 'nome': 'Maria de Souza', 'documento': '456789123', 'telefone': '456789123' },
    { 'nome': 'Pedro Sauro', 'documento': '789123456', 'telefone': '789123456' }

];

var checkins = [];
var checkinClients = [
    { 'checkin': { 'pessoa': clients[0] }, 'valor': '1939,00', 'in': false },
    { 'checkin': { 'pessoa': clients[1] }, 'valor': '949,00', 'in': false },
    { 'checkin': { 'pessoa': clients[2] }, 'valor': '650,00', 'in': false },
];
//checkinClient.checkin.pessoa.nome
var checkinClientsFilter = checkinClients;

$(function () {
    writeTable();
});

function writeTable() {
    for (var i = 0; i < checkinClientsFilter.length; i++) {
        $(table).find('tbody').append(`<tr><td>${checkinClientsFilter[i].checkin.pessoa.nome}</td><td>${checkinClientsFilter[i].checkin.pessoa.documento}</td><td>${checkinClientsFilter[i].valor}</td></tr>`);
    }
}
function addClient() {
    var client = {
        nome: getText('#client-name'),
        documento: getText('#client-document'),
        telefone: getText('#client-phone'),
    };
    clients.push(client);
    $('#addClient').modal('toggle');
    document.getElementById("listClients").innerHTML += '<option value="' + client.nome + '(' + client.documento + ')' + '">';

    resetInputs();
}

function getText(propertyId) {
    return $(propertyId).val()
}

function resetInputs() {
    resetInput('#client-name');
    resetInput('#client-document');
    resetInput('#client-phone');
}

function resetInput(propertyId) {
    $(propertyId).val('')
}

function addCheckin() {
    var checkin = {
        pessoa: getClient(),
        dataEntrada: new Date(getText('#dateEntry')),
        dataSaida: new Date(getText('#dateExit')),
        adicionalVeiculo: document.getElementById("hasCar").checked
    };
    if (valid(checkin)) {
        checkins.push(checkin);
        calculeCheckin(checkin);
        search(document.getElementById("in").checked);
    }
    else {
        alert('A data de entrada não pode ser após a data de saída')
        resetInputs();
    }
}

function getClient() {
    var clientName = $('#clientSelected').val().split('(')[0].trim();
    return clients.filter(f => f.nome == clientName)[0];
}

function valid(checkin) {
    return checkin.dataEntrada < checkin.dataSaida;
}

function calculeCheckin(checkin) {
    var checkinClient = {
        checkin: checkin,
        valor: checkDay(checkin),
        in: new Date() >= checkin.dataEntrada && new Date() <= checkin.dataSaida    
    };
    this.checkinClients.push(checkinClient);
    $(table).find('tbody').append(`<tr><td>${checkinClient.checkin.pessoa.nome}</td><td>${checkinClient.checkin.pessoa.documento}</td><td>${checkinClient.valor}</td></tr>`);
}
function checkDay(checkin) {
    var oneDay = 24 * 60 * 60 * 1000;
    var dayCheckin = checkin.dataEntrada;
    var dayCheckout = checkin.dataSaida;
    var currentDay = dayCheckin.getDay();
    var diffDays = Math.round(Math.abs((dayCheckin.getTime() - dayCheckout.getTime()) / (oneDay)));
    var total = 0;

    //calcula o valor da diária
    for (var i = 0; i < diffDays; i++)
        total += checkDayValue(currentDay++, checkin.adicionalVeiculo);

    //calcula se tem diaria extra no checkout
    var hoursCheckout = checkin.dataSaida.getHours();
    var minutesCheckout = checkin.dataSaida.getMinutes();
    if (hoursCheckout >= 16 && minutesCheckout > 30)
        total += 120;

    return total;
}

function checkDayValue(day, hasCar) {
    if (day === 0 || day === 6) { //finais de semana
        if (hasCar) //com carro
            return 170;
        return 150; //sem carro
    }
    if (hasCar) // não é final de semana
        return 135; //com carro
    return 120; // sem carro
}

function search(op) {
    checkinClientsFilter = [];
    $("tbody").children().remove()
    checkinClientsFilter = checkinClients.filter(f => f.in == op)
    writeTable();
}