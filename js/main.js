var numeroClasses = 3;
var amplitude = 10;
var menorNumero = 0;
var tBody = $('.table').find('#tbody');
var valoresChave = {};

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
    $.each($('#tbody>tr'), function (index) {
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

    $.each($('#tbody>tr'), function (index) {
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

    $('#fitotal').text(fitotalsum);
    $('#ximul2fitotal').text(ximul2fisum);
    $('#ximulfitotaltotal').text(ximulfisum);

    $.each($('#tbody>tr'), function (index) {
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

    valoresChave.sumfi = fitotalsum;
    valoresChave.sumxifi = ximulfisum;
    valoresChave.sumxi2fi = ximul2fisum;
    valoresChave.sumfr = frtotalsum;

    var q3class = (3 * fitotalsum) / 3;
    var q1class = (1 * fitotalsum) / 3;
    var p90class = (90 * fitotalsum) / 100;
    var p10class = (10 * fitotalsum) / 100;

    var classeModal = {};
    var classeQ3 = {};
    var classeQ1 = {};
    var classeP10 = {};
    var classeP90 = {};

    var modaRecorde = -1;

    $.each($('#tbody>tr'), function (index) {
        var newIndex = (amplitude * index) + parseFloat(menorNumero);
        var nextIndex = parseFloat(amplitude) + parseFloat(newIndex);
        if ($(this).find('#fiInput').val() > modaRecorde) {
            classeModal = montarObjetoModal($(this), newIndex);
            modaRecorde = $(this).find('#fiInput').val();
        }
        if ($(this).find('#fac').text() < q3class) {
            classeQ3 = montarClasseQP($(this), newIndex);
        }
        if ($(this).find('#fac').text() < q1class) {
            classeQ1 = montarClasseQP($(this), newIndex);
        }
        if ($(this).find('#fac').text() < p90class) {
            classeP10 = montarClasseQP($(this), newIndex);
        }
        if ($(this).find('#fac').text() < p10class) {
            classeP90 = montarClasseQP($(this), newIndex);
        }
    });

    valoresChave.classeModal = classeModal;
    classeQ3.fracmin = q3class;
    classeQ1.fracmin = q1class;
    classeP10.fracmin = p10class;
    classeP90.fracmin = p90class;
    valoresChave.classeQ3 = classeQ3;
    valoresChave.classeQ1 = classeQ1;
    valoresChave.classeP10 = classeP10;
    valoresChave.classeP90 = classeP90;
    atualizarResultados();
}

function atualizarResultados() {
    console.log(valoresChave);
    var media = valoresChave.sumxifi / valoresChave.sumfi;
    var umsobren = 1 / valoresChave.sumfi;
    var xifi2 = valoresChave.sumxifi * valoresChave.sumxifi;
    var xifi2sobren = xifi2 / valoresChave.sumfi;
    var padraocolchete = valoresChave.sumxi2fi - xifi2sobren;
    var padraoresultado = padraocolchete * umsobren;
    var contas = $('.contas');
    console.log(contas);
    console.log(contas.find('.umsobren'));
    contas.find('#xifi').text(valoresChave.sumxifi.toFixed(2));
    contas.find('#fi').text(valoresChave.sumfi.toFixed(2));
    contas.find('#xi2fi').text(valoresChave.sumxi2fi.toFixed(2));
    contas.find('.umsobren').text(umsobren.toFixed(2));
    contas.find('#xifi2').text(xifi2.toFixed(2));
    contas.find('#xifi2sobren').text(xifi2sobren.toFixed(2));
    contas.find('#padraocolchete').text(padraocolchete.toFixed(2));
    contas.find('#mediaResultado').text(media.toFixed(2));
    contas.find('#padraoresultado').text(padraoresultado.toFixed(2));
}

function montarClasseQP(linha, index) {
    var qp = {};
    qp.lq = index;
    qp.fi = Math.floor($(this).find('#fiInput').val());
    qp.facant = Math.floor(linha.next('tr').find('#fac').text());
    return qp;
}

function montarObjetoModal(linha, index) {
    var modal = {};
    modal.lmo = index;
    modal.fi = Math.floor(linha.find('#fiInput').val());
    var finext = Math.floor(linha.next('tr').find('#fiInput').val());
    modal.finext = finext || 0;
    var fiprev = Math.floor(linha.prev('tr').find('#fiInput').val());
    modal.fiprev = fiprev || 0;
    return modal;
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
}

function somaArray(arr) {
    var soma = 0;
    for (var i = 0; i < arr.length; i++) {
        soma += parseFloat(arr[i]);
    }

    return soma;
}