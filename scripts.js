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
    contas.forEach(function (conta) {
        pesquisarJogador(conta.nick);
    });
}

// Função para carregar os dados do localStorage e preencher os campos
function carregarDadosSalvos() {
    var contasSalvas = JSON.parse(localStorage.getItem('contasLOL')) || [];

    contasSalvas.forEach(function (contaSalva) {
        adicionarConta(contaSalva);
    });
}

// Função para criar uma nova conta e preenchê-la com dados (se fornecidos)
function adicionarConta(dadosConta) {
    var novoID = 'conta' + (document.querySelectorAll('.conta').length + 1);
    var novoConta = document.createElement('div');
    novoConta.className = 'conta';
    novoConta.id = novoID;

    var labels = ['RiotID', 'Login', 'Senha'];
    var classes = ['nick', 'login', 'senha'];

    for (var i = 0; i < labels.length; i++) {
        var label = document.createElement('label');
        label.textContent = labels[i];

        var input = document.createElement('input');
        input.type = 'text';
        input.className = classes[i];

        // Preencher os campos se dados foram fornecidos
        if (dadosConta && dadosConta[classes[i]]) {
            input.value = dadosConta[classes[i]];
        }

        novoConta.appendChild(label);
        novoConta.appendChild(input);
    }

    var eloLabel = document.createElement('label');
    eloLabel.textContent = 'Elo';

    var eloInput = document.createElement('input');
    eloInput.type = 'text';
    eloInput.className = 'elo';
    eloInput.disabled = true;

    // Preencher o campo Elo se dados foram fornecidos
    if (dadosConta && dadosConta.elo) {
        eloInput.value = dadosConta.elo;
    }

    novoConta.appendChild(eloLabel);
    novoConta.appendChild(eloInput);

    var excluirButton = document.createElement('button');
    excluirButton.textContent = 'X';
    excluirButton.onclick = function () {
        excluirConta(novoID);
    };

    novoConta.appendChild(excluirButton);

    document.getElementById('contaBloco').appendChild(novoConta);
}

// Função para excluir uma conta
function excluirConta(idConta) {
    var contaASerExcluida = document.getElementById(idConta);
    contaASerExcluida.parentNode.removeChild(contaASerExcluida);
}

// Carregar os dados salvos ao iniciar a página
carregarDadosSalvos();

function pesquisarJogador() {
    const API_KEY = "RGAPI-7baeb44a-4ade-4482-b126-2bb126cdbe11";
    event.preventDefault();

    const elosTraducoes = {
        IRON: 'Ferro',
        BRONZE: 'Bronze',
        SILVER: 'Prata',
        GOLD: 'Ouro',
        PLATINUM: 'Platina',
        DIAMOND: 'Diamante',
        MASTER: 'MESTRE',
        GRANDMASTER: 'GRÃO-MESTRE',
        CHALLENGER: 'DESAFIANTE'
    };

    // Obtém o nick do jogador do input RiotID
    var nickInput = document.querySelector('.nick');
    var nick = nickInput.value;

    fetch('https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + encodeURIComponent(nick) + '?api_key=' + API_KEY)
        .then(response => response.json())
        .then(data => {
            var jogadorId = data.id;

            fetch('https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + jogadorId + '?api_key=' + API_KEY)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        var elo = data[0].tier;
                        var eloTraduzido = elosTraducoes[elo.toUpperCase()];

                        // Preencher o campo de elo desativado
                        var campoElo = document.querySelector('.elo');
                        campoElo.value = eloTraduzido;
                    } else {
                        console.log('O jogador não tem entradas de liga');
                    }
                })
                .catch(error => {
                    console.log('Erro na obtenção das informações da liga do jogador', error);
                });
        })
        .catch(error => {
            console.log('Erro na obtenção do ID do jogador', error);
        });
}

