// Função para armazenar as modificações nos campos, exceto o Elo.conta
function salvarModificacoes() {
    var contas = [];
    var contaElements = document.querySelectorAll('.conta');

    contaElements.forEach(function (contaElement) {
        var conta = {
            nick: contaElement.querySelector('.nick').value,
            login: contaElement.querySelector('.login').value,
            senha: contaElement.querySelector('.senha').value,
            cor: contaElement.querySelector('.cor-picker').value
        };

        contas.push(conta);
    });

    localStorage.setItem('contasLOL', JSON.stringify(contas));
    console.log('Contas salvas:', contas);
}

// Função para adicionar uma nova conta
function adicionarConta(dadosConta) {
    var novoID = 'conta' + (document.querySelectorAll('.conta').length + 1);
    var novoConta = document.createElement('div');
    novoConta.className = 'conta';
    novoConta.id = novoID;
    novoConta.draggable = true;

    var divImagem = document.createElement('div');
    divImagem.className = 'logotipo';
    var imagem = document.createElement('img');
    imagem.src = '/img/logo.png';
    divImagem.appendChild(imagem);
    novoConta.appendChild(divImagem);

    var campos = [
        { label: 'RiotID#00000', classe: 'nick' },
        { label: 'Login', classe: 'login' },
        { label: 'Senha', classe: 'senha' }
    ];

    campos.forEach(function (campo) {
        var divCampo = document.createElement('div');
        divCampo.className = 'campo';

        // Adicionar div para a label e o botão
        var divLabelBotao = document.createElement('div');
        var label = document.createElement('label');
        label.textContent = campo.label;
        divLabelBotao.appendChild(label);

        // Adicionar botão "Copiar" após o campo de login e senha
        if (campo.classe === 'login' || campo.classe === 'senha') {
            var copiarButton = document.createElement('button');
            copiarButton.innerHTML = '<img src="/img/clipboard.png" />'
            copiarButton.className = 'clipboard';
            copiarButton.setAttribute('data-type', campo.classe);
            copiarButton.onclick = function () {
                copiarParaClipboard(this.getAttribute('data-type'), novoConta);
            };
            divLabelBotao.appendChild(copiarButton);
        }

        divCampo.appendChild(divLabelBotao);

        // Adicionar div para o input
        var divInput = document.createElement('div');
        var input = document.createElement('input');
        input.type = 'text';
        input.className = campo.classe;

        // Preencher os campos se dados foram fornecidos
        if (dadosConta && dadosConta[campo.classe]) {
            input.value = dadosConta[campo.classe];
        }

        divInput.appendChild(input);

        divCampo.appendChild(divInput);
        novoConta.appendChild(divCampo);
    });

    // Adicionar div "botoes"
    var divBotoes = document.createElement('div');
    divBotoes.className = 'botoes';

    // Adicionar o color picker
    var corPicker = document.createElement('input');
    var corPickerImg = document.createElement('img');
    corPickerImg.src = "/img/colorpicker.png"; 
    corPicker.type = 'color';
    corPicker.className = 'cor-picker';
    corPicker.value = '#181818'; // Cor padrão
    corPicker.addEventListener('change', function () {
        novoConta.style.backgroundColor = corPicker.value;
    });
    corPicker.appendChild(corPickerImg);
    divBotoes.appendChild(corPicker);

    // Adicionar botão para OPGG
    var opggButton = document.createElement('a');
    opggButton.className = 'opgg';
    opggButton.textContent = 'OP.GG';
    opggButton.onclick = function () {
        var nick = novoConta.querySelector('.nick').value;
        window.open('https://www.op.gg/summoners/br/' + encodeURIComponent(nick.replace("#", "-")), '_blank');
    };
    divBotoes.appendChild(opggButton);

    // Adicionar botão de exclusão dentro da div "botoes"
    var excluirButton = document.createElement('button');
    excluirButton.textContent = 'X';
    excluirButton.id = 'excluir';
    excluirButton.onclick = function () {
        excluirConta(novoID);
    };
    divBotoes.appendChild(excluirButton);

    novoConta.appendChild(divBotoes);

    // Adicionar manipuladores de eventos para arrastar e soltar
    novoConta.addEventListener("dragstart", iniciarArrastar);
    novoConta.addEventListener("dragover", permitirSoltar);
    novoConta.addEventListener("drop", soltar);

    document.getElementById('contaBloco').appendChild(novoConta);

    // Se houver dados salvos para a cor, aplicar a cor ao carregar
    if (dadosConta && dadosConta.cor) {
        novoConta.style.backgroundColor = dadosConta.cor;
        corPicker.value = dadosConta.cor;
    }

    if (!novoConta.style.backgroundColor) {
        novoConta.style.backgroundColor = '#181818';
    }
}

// Função para copiar o valor para a área de transferência
function copiarParaClipboard(tipo, divConta) {
    var campo;
    if (tipo === 'login' || tipo === 'senha') {
        campo = divConta.querySelector('.' + tipo);
    }

    // Verificar se o campo foi encontrado
    if (campo) {
        // Criar um elemento de input temporário
        var inputTemporario = document.createElement('input');
        inputTemporario.setAttribute('value', campo.value);

        // Adicionar o elemento de input temporário ao documento
        document.body.appendChild(inputTemporario);

        // Selecionar e copiar o conteúdo do elemento de input
        inputTemporario.select();
        document.execCommand('copy');

        // Remover o elemento de input temporário
        document.body.removeChild(inputTemporario);

        // Exibir mensagem temporária
        exibirAlertaTemporario('Texto copiado para a área de transferência.', 2000);
    }
}

function ocultarSenhas() {
    var senhas = document.querySelectorAll('.senha');

    senhas.forEach(function (senha) {
        if (senha.type === 'password') {
            senha.type = 'text';
        } else {
            senha.type = 'password';
        }
    });

    var botao = document.getElementById('botaoOcultar');
    if (botao.textContent.trim() === 'OCULTAR SENHAS') {
        botao.innerHTML = '<img src="/img/mostrar.png" alt="Mostrar Senhas" /> MOSTRAR';
    } else {
        botao.innerHTML = '<img src="/img/ocultar.png" alt="Ocultar Senhas" /> OCULTAR';
    }
}

// Função para exibir um alerta temporário acima de contaBloco
function exibirAlertaTemporario(mensagem, tempo) {
    var alerta = document.createElement('div');
    alerta.textContent = mensagem;
    alerta.className = 'alertaTemporario';

    // Inserir a div alerta-temporario acima de contaBloco
    document.getElementById('contaBloco').parentNode.insertBefore(alerta, document.getElementById('contaBloco'));

    setTimeout(function () {
        document.getElementById('contaBloco').parentNode.removeChild(alerta);
    }, tempo);
}

// Função para excluir uma conta
function excluirConta(idConta) {
    var contaASerExcluida = document.getElementById(idConta);
    contaASerExcluida.parentNode.removeChild(contaASerExcluida);
}

// Função para iniciar o arrastar
function iniciarArrastar(event) {
    event.dataTransfer.setData("text", event.target.id);
}

// Função para permitir soltar
function permitirSoltar(event) {
    event.preventDefault();
}

// Função para soltar a div arrastada
function soltar(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var divArrastada = document.getElementById(data);
    var divAlvo = event.target.closest('.conta');

    if (divArrastada && divAlvo) {
        if (divArrastada !== divAlvo) {
            if (event.clientY < divAlvo.getBoundingClientRect().top + divAlvo.offsetHeight / 2) {
                divAlvo.parentNode.insertBefore(divArrastada, divAlvo);
            } else {
                divAlvo.parentNode.insertBefore(divArrastada, divAlvo.nextSibling);
            }
        }
    }
}

// Carregar os dados salvos ao iniciar a página
carregarDadosSalvos();

// Função para baixar as informações no formato .txt
function baixarInformacoes() {
    var contasSalvas = JSON.parse(localStorage.getItem('contasLOL')) || [];
    var texto = '';

    contasSalvas.forEach(function (contaSalva) {
        texto += 'Nick: ' + contaSalva.nick + '\n';
        texto += 'Login: ' + contaSalva.login + '\n';
        texto += 'Senha: ' + contaSalva.senha + '\n' + '\n';

    });

    var blob = new Blob([texto], { type: 'text/plain' });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'informacoes_contas.txt';
    link.click();
}

function carregarDadosSalvos() {
    var contasSalvas = JSON.parse(localStorage.getItem('contasLOL')) || [];

    contasSalvas.forEach(function (contaSalva) {
        adicionarConta(contaSalva);
    });
}

// Função para mostrar o tooltip com timer de 1000ms
function mostrarAviso() {
    document.querySelector('.background').style.display = 'block';
    var tooltip = document.querySelector('.tooltiptext');
    tooltip.style.display = 'block';
}

function fecharAviso() {
    document.querySelector('.background').style.display = 'none';
    var tooltip = document.querySelector('.tooltiptext');
    tooltip.style.display = 'none';
}