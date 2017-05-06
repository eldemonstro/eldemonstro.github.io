var numeroClasses = 3;
var amplitude = 10;
var menorNumero = 0;
var tBody = $('.table').find('tbody');

$(() => {
    inicializar();
});

function inicializar() {
    adicionarLinha();
    adicionarLinha();
    adicionarLinha();
    atualizarTabela();
}

function adicionarLinha() {
    var linha = montarLinha();
    linha.find("#fiInput").on('input', fiInput);
    tBody.append(linha);
}

function montarLinha() {
    var linha = $('<tr>');
    var classes = $('<th>').attr('id', 'classes').text("⊢");

    var fiInput = $('<input>')
        .attr('id', 'fiInput')
        .attr('type', 'number')
        .attr('min', '1')
        .attr('value', '1')
        .addClass('form-control');

    var fi = $('<td>').attr('id', 'fi');
    var xi = $('<td>').attr('id', 'xi');
    var fac = $('<td>').attr('id', 'fac');
    var xifi = $('<td>').attr('id', 'xifi');
    var fr = $('<td>').attr('id', 'fr');
    var xi2fi = $('<td>').attr('id', 'xi2fi');

    fi.append(fiInput);
    linha.append(classes).append(fi).append(xi).append(fac).append(xifi).append(fr).append(xi2fi);

    return linha;
}

function limparTabela() {
    $.each($('tbody>tr'), function (index) {
        var newIndex = amplitude * (index);
        $(this).remove();
    });
}

function atualizarTabela() {
    var fac = [];
    var fitotal = [];
    var ximulfitotal = [];
    var ximul2fitotal = [];
    var frtotal = [];

    $.each($('tbody>tr'), function (index) {
        var newIndex = (amplitude * index) + parseFloat(menorNumero);
        var nextIndex = parseFloat(amplitude) + parseFloat(newIndex);
        var pMedio = (newIndex + nextIndex) / 2;
        var fiValue = $(this).find('#fiInput').val();
        var ximulfi = fiValue * pMedio;
        var ximul2fi = ximulfi * pMedio;
        fitotal.push(fiValue);
        ximulfitotal.push(ximulfi);
        ximul2fitotal.push(ximul2fi);
        fac.push(fiValue);
        var soma = somaArray(fac);

        $(this).find('#classes').text(newIndex + "⊢" + nextIndex);
        $(this).find('#xi').text(pMedio);
        $(this).find('#fac').text(soma);
        $(this).find('#xifi').text(ximulfi);
        $(this).find('#xi2fi').text(ximul2fi);
    });

    var fitotalsum = somaArray(fitotal);
    var ximulfisum = somaArray(ximulfitotal);
    var ximul2fisum = somaArray(ximul2fitotal);
    console.log(somaArray(ximul2fitotal));

    $('#fitotal').text(fitotalsum);
    $('#ximul2fitotal').text(ximul2fisum);
    $('#ximulfitotaltotal').text(ximulfisum);

    $.each($('tbody>tr'), function (index) {
        var currentFi = $(this).find('#fiInput').val();
        var fr = (currentFi / fitotalsum) * 100;
        $(this).find('#fr').text(fr.toFixed(4));
        frtotal.push(fr);
    });
    var frtotalsum = somaArray(frtotal);
    if (frtotalsum > 99.9) {
        frtotalsum = 100;
    }
    $('#frtotal').text(frtotalsum.toFixed(0));
}

$('#classesInput').on('input', function (event) {
    limparTabela();
    for (var i = 0; i < $(this).val(); i++) {
        adicionarLinha();
    }
    atualizarTabela();
});

$('#amplitudeInput').on('input', function (event) {
    amplitude = $(this).val();
    atualizarTabela();
});

$('#menorvalorInput').on('input', function (event) {
    menorNumero = $(this).val();
    atualizarTabela();
});

function fiInput(event) {
    atualizarTabela();
    console.log(event);
}

function somaArray(arr) {
    var soma = 0;
    for (var i = 0; i < arr.length; i++) {
        soma += parseFloat(arr[i]);
    }

    return soma;
}