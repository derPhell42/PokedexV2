document.addEventListener("DOMContentLoaded", function () {
    // Extrair o número do Pokémon da URL
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonNumber = urlParams.get('pokemonNumber');

    // Obter os detalhes do Pokémon com base no número
    fetchPokemonDetails(pokemonNumber);
});

function fetchPokemonDetails(pokemonNumber) {
    // Remover os zeros à esquerda do número do Pokémon
    const formattedPokemonNumber = parseInt(pokemonNumber, 10);

    // Faça uma solicitação para a API para obter os detalhes do Pokémon com base no número
    fetch(`https://pokeapi.co/api/v2/pokemon/${formattedPokemonNumber}`)
        .then(response => response.json())
        .then(pokeDetail => {
            // Montar a instância do objeto Pokemon com os detalhes do Pokémon
            const pokemon = new Pokemon();
            pokemon.number = formatNumber(pokeDetail.id)
            pokemon.name = pokeDetail.name

            const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
            const [type] = types

            pokemon.types = types
            pokemon.type = type

            // Chama a função para atualizar as cores dos tipos do Pokémon
            updateTypeColors(pokemon);

            pokemon.photo = pokeDetail.sprites.other['official-artwork'].front_default
            pokemon.photoSh = pokeDetail.sprites.other['official-artwork'].front_shiny
            pokemon.photo3DMale = pokeDetail.sprites.other.home.front_default
            pokemon.photo3DMaleSh = pokeDetail.sprites.other.home.front_shiny
            pokemon.photo3DFemale = pokeDetail.sprites.other.home.front_female
            pokemon.photo3DFemale = pokeDetail.sprites.other.home.front_shiny_female
            pokemon.photoShowdownM = pokeDetail.sprites.other.showdown.front_default
            pokemon.photoShowdownF = pokeDetail.sprites.other.showdown.front_female
            pokemon.photoShowdownMSH = pokeDetail.sprites.other.showdown.front_shiny
            pokemon.photoShowdownFSH = pokeDetail.sprites.other.showdown.front_shiny_female
            pokemon.photoBWGifF = pokeDetail.sprites.versions['generation-v']['black-white'].animated.front_default;
            pokemon.photoBWGif = pokeDetail.sprites.versions['generation-v']['black-white'].animated.front_female;
            pokemon.photoBWGifFSH = pokeDetail.sprites.versions['generation-v']['black-white'].animated.front_shiny;
            pokemon.photoBWGifFFSH = pokeDetail.sprites.versions['generation-v']['black-white'].animated.front_shiny_female;
            pokemon.icon = pokeDetail.sprites.versions['generation-viii'].icons.front_default;


            pokemon.cries = pokeDetail.cries.latest

            pokeDetail.stats.forEach(stat => {
                const statName = stat.stat.name;
                const baseStat = stat.base_stat;
                switch (statName) {
                    case 'hp':
                        pokemon.hp = baseStat;
                        break;
                    case 'attack':
                        pokemon.atk = baseStat;
                        break;
                    case 'defense':
                        pokemon.def = baseStat;
                        break;
                    case 'special-attack':
                        pokemon.spatk = baseStat;
                        break;
                    case 'special-defense':
                        pokemon.spdef = baseStat;
                        break;
                    case 'speed':
                        pokemon.speed = baseStat;
                        break;
                    default:
                        break;
                }
            });

            pokemon.height = pokeDetail.height;
            pokemon.weight = pokeDetail.weight;

            // Função para formatar a altura do Pokémon
            function formatHeight(height) {
                const feet = Math.floor(height * 0.328084);
                const inches = Math.round((height * 0.328084 - feet) * 12);
                const meters = (height / 10).toFixed(1); // Converter de decímetros para metros
                const inchesString = inches < 10 ? `0${inches}` : `${inches}`;
                return `${feet}'${inchesString}" - ${meters} m`;
            }

            function formatWeight(weight) {
                const lbs = (weight * 0.220462).toFixed(1); // Converter para libras com uma casa decimal
                const kg = (weight / 10).toFixed(1); // Converter para quilogramas com uma casa decimal
                return `${lbs} lbs - ${kg} kg`;
            }

            // Usando as funções de formatação
            const formattedHeight = formatHeight(pokemon.height);
            const formattedWeight = formatWeight(pokemon.weight);

            pokeDetail.abilities.forEach((abilityInfo) => {
                if (abilityInfo.is_hidden) {
                    pokemon.ablt3hidden = abilityInfo.ability.name;
                } else {
                    if (!pokemon.ablt1) {
                        pokemon.ablt1 = abilityInfo.ability.name;
                    } else {
                        pokemon.ablt2 = abilityInfo.ability.name;
                    }
                }
            });

            const pokemonImage = document.querySelector('.poke-photo');
            pokemonImage.src = pokemon.photo;
            pokemonImage.alt = pokemon.name;

            const nameElement = document.querySelector('.name p');
            nameElement.textContent = pokemon.name;

            const numberElement = document.querySelector('.pkm-nmbr');
            numberElement.textContent = `#${pokemon.number}`;

            const hweightElement = document.querySelector('.poke-data');
            hweightElement.textContent = `Peso: ${formattedWeight} | Altura: ${formattedHeight}`;

            const hpElement = document.querySelector('.poke-stats p:nth-of-type(1)');
            hpElement.textContent = `HP - ${pokemon.hp}`;

            const atkElement = document.querySelector('.poke-stats p:nth-of-type(2)');
            atkElement.textContent = `ATK - ${pokemon.atk}`;

            const defElement = document.querySelector('.poke-stats p:nth-of-type(3)');
            defElement.textContent = `DEF - ${pokemon.def}`;

            const spatkElement = document.querySelector('.poke-stats p:nth-of-type(4)');
            spatkElement.textContent = `SPATK - ${pokemon.spatk}`;

            const spdefElement = document.querySelector('.poke-stats p:nth-of-type(5)');
            spdefElement.textContent = `SPDEF - ${pokemon.spdef}`;

            const speedElement = document.querySelector('.poke-stats p:nth-of-type(6)');
            speedElement.textContent = `Speed - ${pokemon.speed}`;

            const ablt1Element = document.querySelector('.normal-ablt :nth-of-type(1)');
            ablt1Element.textContent = pokemon.ablt1;

            const ablt2Element = document.querySelector('.normal-ablt :nth-of-type(2)');
            ablt2Element.textContent = pokemon.ablt2;

            const hiddenabltElement = document.querySelector('.hidden-ablt p');
            hiddenabltElement.textContent = pokemon.ablt3hidden;

            // Obter elemento HTML onde deseja exibir o choro do Pokémon
            const cryElement = document.querySelector('.poke-photo');
            cryElement.dataset.cry = pokemon.cries; // Atribua a URL do áudio aqui



            // Adicionar ouvinte de evento de clique aos botões de coração
            document.querySelectorAll('.badge-heart-button').forEach(button => {
                button.addEventListener('click', () => {
                    // Verifique o estado atual do botão (se é "inactive" ou "active")
                    const currentState = button.getAttribute('data-state');

                    // Alternar as classes e o atributo src da imagem com base no estado atual
                    if (currentState === 'inactive') {
                        button.setAttribute('data-state', 'active');
                        button.querySelector('.badge-heart').src = "/assets/img/heartColored.svg";
                    } else {
                        button.setAttribute('data-state', 'inactive');
                        button.querySelector('.badge-heart').src = "/assets/img/heartEmpty.svg";
                    }
                });
            });

            // Adicionar ouvinte de evento de clique aos botões shiny
            document.querySelectorAll('.badge-shiny-button').forEach(button => {
                button.addEventListener('click', () => {
                    // Verificar o estado atual do botão
                    const currentState = button.getAttribute('data-state');

                    // Obter a imagem do pokémon associada ao botão clicado
                    const pokemonPhoto = document.querySelector('.poke-photo');

                    // Alterar a imagem com base no estado atual do botão
                    if (currentState === 'inactive') {
                        button.setAttribute('data-state', 'active');
                        button.querySelector('.badge-shiny').src = "/assets/img/ShinyMarkColored.svg";
                        // Alterar a imagem de poke-photo para a versão brilhante
                        pokemonPhoto.src = pokemon.photoSh;
                    } else {
                        button.setAttribute('data-state', 'inactive');
                        button.querySelector('.badge-shiny').src = "/assets/img/ShinyMarkEmpty.svg";
                        // Voltar a imagem de poke-photo para a versão padrão
                        pokemonPhoto.src = pokemon.photo;
                    }
                });
            });

            // Adicionar ouvinte de evento de clique aos botões de pokeball
            document.querySelectorAll('.badge-pokeball-button').forEach(button => {
                button.addEventListener('click', () => {
                    // Verifique o estado atual do botão
                    const currentState = button.getAttribute('data-state');

                    // Alternar as classes e o atributo src da imagem com base no estado atual
                    if (currentState === 'inactive') {
                        button.setAttribute('data-state', 'active');
                        button.querySelector('.badge-pokeball').src = "/assets/img/PokeballColored.svg";
                    } else if (currentState === 'active') {
                        button.setAttribute('data-state', 'active-shiny');
                        button.querySelector('.badge-pokeball').src = "/assets/img/PokeballColoredShiny.svg";
                    } else if (currentState === 'active-shiny') {
                        button.setAttribute('data-state', 'active-event');
                        button.querySelector('.badge-pokeball').src = "/assets/img/PokeballColoredEvent.svg";
                    } else if (currentState === 'active-event') {
                        button.setAttribute('data-state', 'active-event-shiny');
                        button.querySelector('.badge-pokeball').src = "/assets/img/PokeballColoredEventSh.svg";
                    } else {
                        button.setAttribute('data-state', 'inactive');
                        button.querySelector('.badge-pokeball').src = "/assets/img/PokeballEmpty.svg";
                    }
                });
            });

            // Adicionar ouvinte de evento de clique aos botões de trade
            document.querySelectorAll('.badge-trade-button').forEach(button => {
                button.addEventListener('click', () => {
                    // Verifique o estado atual do botão
                    const currentState = button.getAttribute('data-state');

                    // Alternar os estados e a imagem com base no estado atual
                    if (currentState === 'inactive') {
                        button.setAttribute('data-state', 'active');
                        button.querySelector('.badge-trade').src = "/assets/img/TradeV2Colored.svg";
                    } else if (currentState === 'active') {
                        button.setAttribute('data-state', 'active-shiny');
                        button.querySelector('.badge-trade').src = "/assets/img/TradeV2ColoredShiny.svg";
                    } else if (currentState === 'active-shiny') {
                        button.setAttribute('data-state', 'active-event');
                        button.querySelector('.badge-trade').src = "/assets/img/TradeV2Event.svg";
                    } else if (currentState === 'active-event') {
                        button.setAttribute('data-state', 'active-eventsh');
                        button.querySelector('.badge-trade').src = "/assets/img/TradeV2EventSh.svg";
                    } else {
                        button.setAttribute('data-state', 'inactive');
                        button.querySelector('.badge-trade').src = "/assets/img/TradeV2Empty.svg";
                    }
                });
            });

            document.querySelectorAll('.badge-lkg-trade-button').forEach(button => {
                button.addEventListener('click', () => {
                    // Verifique o estado atual do botão
                    const currentState = button.getAttribute('data-state');

                    // Alternar as classes e o atributo src da imagem com base no estado atual
                    if (currentState === 'inactive') {
                        button.setAttribute('data-state', 'active');
                        button.querySelector('.badge-lkg-trade').src = "/assets/img/LokingballColored.svg";
                    } else if (currentState === 'active') {
                        button.setAttribute('data-state', 'active-shiny');
                        button.querySelector('.badge-lkg-trade').src = "/assets/img/LokingballColoredShiny.svg";
                    } else if (currentState === 'active-shiny') {
                        button.setAttribute('data-state', 'active-event');
                        button.querySelector('.badge-lkg-trade').src = "/assets/img/LokingballEvent.svg";
                    } else if (currentState === 'active-event') {
                        button.setAttribute('data-state', 'active-event-shiny');
                        button.querySelector('.badge-lkg-trade').src = "/assets/img/LokingballEventSh.svg";
                    } else {
                        button.setAttribute('data-state', 'inactive');
                        button.querySelector('.badge-lkg-trade').src = "/assets/img/LokingballEmpty.svg";
                    }
                });
            });

            // Continue manipulando o DOM para exibir outros detalhes do Pokémon conforme necessário
        })
        .catch(error => {
            console.error('Ocorreu um erro ao buscar os detalhes do Pokémon:', error);
        });
}

// Adicionar evento de clique para as imagens de Pokémon
document.querySelectorAll('.poke-photo').forEach(img => {
    img.addEventListener('click', () => {
        const cryUrl = img.getAttribute('data-cry');
        playPokemonCry(cryUrl);
    });
});

function playPokemonCry(cryUrl, volume = 0.1) {
    // Cria um elemento de áudio
    var audio = new Audio(cryUrl);

    // Define o volume do áudio
    audio.volume = volume;

    // Adiciona um evento de carga para garantir que o áudio esteja pronto para reprodução
    audio.addEventListener('canplaythrough', () => {
        // Tenta reproduzir o áudio
        audio.play()
            .then(() => {
                console.log('Áudio do choro reproduzido com sucesso!');
            })
            .catch((error) => {
                console.error('Erro ao reproduzir áudio do choro:', error);
            });
    }, false);
}


function updateTypeColors(pokemon) {
    const leftColorDiv = document.querySelector('.left-color');
    const rightColorDiv = document.querySelector('.right-color');
    const badgeTypes = document.querySelectorAll('.badge-types img');

    // Verificar se o Pokémon tem pelo menos um tipo
    if (pokemon.types.length > 0) {
        // Define o gradiente de cor para a div direita com base no primeiro tipo do Pokémon
        rightColorDiv.style.background = `linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 72%), var(--${pokemon.types[0]})`;
        rightColorDiv.style.display = 'block'; // Exibir a div da direita

        // Atualizar as badges do Pokémon com base nos tipos
        badgeTypes.forEach((badge, index) => {
            if (index < pokemon.types.length) {
                badge.src = `/assets/img/Badges/${pokemon.types[index]}Badge.png`;
                badge.alt = `${pokemon.types[index]} Type`;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        });

        // Verificar se o Pokémon tem dois tipos
        if (pokemon.types.length > 1) {
            // Define o gradiente de cor para a div esquerda com base no segundo tipo do Pokémon
            leftColorDiv.style.background = `linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 72%), var(--${pokemon.types[1]})`;
            leftColorDiv.style.display = 'block'; // Exibir a div da esquerda
        } else {
            // Se o Pokémon tiver apenas um tipo, define a cor da div direita igual à cor da div esquerda
            leftColorDiv.style.background = rightColorDiv.style.background;
            leftColorDiv.style.display = 'block'; // Exibir a div da esquerda
        }
    } else {
        // Se o Pokémon não tiver tipo, ocultar ambas as divs de cores e as badges
        leftColorDiv.style.display = 'none';
        rightColorDiv.style.display = 'none';
        badgeTypes.forEach(badge => {
            badge.style.display = 'none';
        });
    }
}

// Chamada da função para atualizar as cores dos tipos e as badges do Pokémon
updateTypeColors(pokemon);