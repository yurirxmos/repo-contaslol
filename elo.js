function pesquisarJogador(nick) {
    const API_KEY = "RGAPI-7baeb44a-4ade-4482-b126-2bb126cdbe11";
    event.preventDefault();

    const elosTraducoes = {
        IRON: 'FERRO',
        BRONZE: 'BRONZE',
        SILVER: 'PRATA',
        GOLD: 'OURO',
        PLATINUM: 'PLATINA',
        DIAMOND: 'DIAMANTE',
        MASTER: 'MESTRE',
        GRANDMASTER: 'GRÃO-MESTRE',
        CHALLENGER: 'DESAFIANTE'
    };

    var novaDivResultados = document.createElement('div');
    novaDivResultados.className = 'resultado';
    novaDivResultados.style.display = 'flex';

    fetch('https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + encodeURIComponent(nick) + '?api_key=' + API_KEY)
        .then(response => response.json())
        .then(data => {
            var jogadorId = data.id;

            fetch('https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + jogadorId + '?api_key=' + API_KEY)
                .then(response => response.json())
                .then(data => {
                    // Supondo que o jogador tenha pelo menos uma entrada de liga
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
