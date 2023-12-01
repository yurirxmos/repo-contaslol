// Função para armazenar as modificações nos campos, exceto o Elo
function salvarModificacoes() {
    var contas = [];
    var contaElements = document.querySelectorAll('.conta');

    contaElements.forEach(function (contaElement) {
        var conta = {
            nick: contaElement.querySelector('.nick').value,
            login: contaElement.querySelector('.login').value,
            senha: contaElement.querySelector('.senha').value,
        };

        contas.push(conta);
    });

    localStorage.setItem('contasLOL', JSON.stringify(contas));
    console.log('Contas salvas:', contas);

    // Após salvar, pesquisar o Elo para todos os RiotIDs
    pesquisarElos();
}

// Função para carregar os dados do localStorage e preencher os campos
function carregarDadosSalvos() {
    var contasSalvas = JSON.parse(localStorage.getItem('contasLOL')) || [];

    contasSalvas.forEach(function (contaSalva) {
        adicionarConta(contaSalva);
    });

    // Após carregar os dados salvos, pesquisar o Elo para todos os RiotIDs
    pesquisarElos();
}

function adicionarConta(dadosConta) {
    var novoID = 'conta' + (document.querySelectorAll('.conta').length + 1);
    var novoConta = document.createElement('div');
    novoConta.className = 'conta';
    novoConta.id = novoID;

    var campos = [
        { label: 'RiotID#00000', classe: 'nick' },
        { label: 'Login', classe: 'login' },
        { label: 'Senha', classe: 'senha' }
    ];

    campos.forEach(function (campo) {
        var divCampo = document.createElement('div');

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

    // Adicionar campo de Elo
    var divElo = document.createElement('div');

    // Adicionar div para a label de Elo
    var divLabelElo = document.createElement('div');
    var eloLabel = document.createElement('label');
    eloLabel.textContent = 'Elo';
    divLabelElo.appendChild(eloLabel);

    divElo.appendChild(divLabelElo);

    // Adicionar div para o input de Elo
    var divInputElo = document.createElement('div');
    var eloInput = document.createElement('input');
    eloInput.type = 'text';
    eloInput.className = 'elo';
    eloInput.disabled = true;


    divInputElo.appendChild(eloInput);

    divElo.appendChild(divInputElo);
    novoConta.appendChild(divElo);

    // Adicionar botão de exclusão
    var excluirButton = document.createElement('button');
    excluirButton.textContent = 'X';
    excluirButton.className = 'excluir';
    excluirButton.onclick = function () {
        excluirConta(novoID);
    };

    novoConta.appendChild(excluirButton);

    document.getElementById('contaBloco').appendChild(novoConta);

    // Pesquisar Elo após adicionar conta
    pesquisarElos();
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
        exibirAlertaTemporario('Texto copiado para a área de transferência.', 3000);
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

    // Após excluir a conta, pesquisar o Elo para todos os RiotIDs
    pesquisarElos();
}

// Função para pesquisar o Elo de todas as contas
function pesquisarElos() {
    var contaElements = document.querySelectorAll('.conta');

    contaElements.forEach(function (contaElement) {
        var nickInput = contaElement.querySelector('.nick');
        var eloInput = contaElement.querySelector('.elo');

        pesquisarJogador(nickInput.value, eloInput);
    });
}

// Função para pesquisar o Elo e LP do jogador
function pesquisarJogador(nick, eloInput) {
    const API_KEY = "RGAPI-7baeb44a-4ade-4482-b126-2bb126cdbe11";
    const [nomeUsuario, tagline] = nick.split('#');

    fetch('https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/' + encodeURIComponent(nomeUsuario) + '/' + encodeURIComponent(tagline) + '?api_key=' + API_KEY)
        .then(data => {
        
            fetch('https://br1.api.riotgames.com/lol/league/v4/entries/by-puuid/' + data.puuid + '?api_key=' + API_KEY)
                .then(data => {

                    fetch('https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + data.id + '?api_key=' + API_KEY)
                        .then(data => {
                            if (data.length > 0) {
                                var tier = data[0].tier;
                                var rank = data[0].rank;
                                var leaguePoints = data[0].leaguePoints;
                                var eloTraduzido = traduzirElo(tier, rank);

                                eloInput.value = eloTraduzido + ' ' + leaguePoints + ' PDL';
                            } else {
                                eloInput.value = 'Não ranqueado';
                            }
                        })
                        .catch(error => {
                            console.log('Erro na obtenção das informações da liga do jogador\n', error);
                        });

                })
                .catch(error => {
                    console.log('Erro na obtenção das informações da liga do jogador\n', error);
                });

        })
        .catch(error => {
            console.log('Erro na obtenção do PUUID do jogador\n', error);
        });
}


// Função para traduzir o elo para o formato desejado
function traduzirElo(tier, rank) {
    const elosTraducoes = {
        IRON: 'Ferro',
        BRONZE: 'Bronze',
        SILVER: 'Prata',
        GOLD: 'Ouro',
        PLATINUM: 'Platina',
        EMERALD: 'Esmeralda',
        DIAMOND: 'Diamante',
        MASTER: 'Mestre',
        GRANDMASTER: 'Grão-Mestre',
        CHALLENGER: 'Desafiante'
    };

    return elosTraducoes[tier.toUpperCase()] + ' ' + rank;
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
        texto += 'Senha: ' + contaSalva.senha + '\n';
        texto += 'Elo: ' + contaSalva.elo + '\n\n';
    });

    var blob = new Blob([texto], { type: 'text/plain' });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'informacoes_contas.txt';
    link.click();
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
        botao.innerHTML = '<img src="/img/mostrar.png" alt="Mostrar Senhas" /> MOSTRAR SENHAS';
    } else {
        botao.innerHTML = '<img src="/img/ocultar.png" alt="Ocultar Senhas" /> OCULTAR SENHAS';
    }
}





// Função para carregar as informações a partir de um arquivo
function carregarInformacoesDoArquivo() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.addEventListener('change', function () {
        var file = input.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var content = e.target.result;
                preencherCamposComInformacoes(content);
            };
            reader.readAsText(file);
        }
    });
    input.click();
}

// Função para preencher os campos com as informações do arquivo
function preencherCamposComInformacoes(content) {
    var contas = content.split('\n\n');

    contas.forEach(function (conta) {
        var linhas = conta.split('\n');
        var dadosConta = {};

        linhas.forEach(function (linha) {
            var [chave, valor] = linha.split(': ');
            if (chave && valor) {
                dadosConta[chave.toLowerCase()] = valor;
            }
        });

        adicionarConta(dadosConta);
    });
}

// Event listener para o botão de upload
var uploadButton = document.getElementById('uploadButton');
uploadButton.addEventListener('click', carregarInformacoesDoArquivo);