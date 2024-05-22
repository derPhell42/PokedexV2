const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 450;
const limit = 62;
let offset = 0;

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => {
            const typeClasses = pokemon.types.join(' ');
            const background = getBackgroundGradient(pokemon.types);
            return `          
                <li class="pokemon ${typeClasses} pokemon-clickable" style="${background}" data-number="${pokemon.number}">
                    <span class="number">
                        <div class="badge-number-container">
                            <button class="badge-heart-button" data-state="inactive" title="Favorite!">
                                <img class="badge-heart" src="/assets/img/heartEmpty.svg" alt="Favorite">
                            </button>
                            <button class="badge-shiny-button" data-state="inactive" title="Shiny!">
                                <img class="badge-shiny" src="/assets/img/ShinyMarkEmpty.svg" alt="Shiny">
                            </button>
                            <button class="badge-pokeball-button" data-state="inactive" title="Caught!">
                                <img class="badge-pokeball" src="/assets/img/PokeballEmpty.svg" alt="Caught">
                            </button>
                            <button class="badge-trade-button" data-state="inactive" title="Ready for trade">
                                <img class="badge-trade" src="/assets/img/TradeV2Empty.svg" alt="Tradeable">
                            </button>
                            <button class="badge-lkg-trade-button" data-state="inactive" title="Seeking">
                                <img class="badge-lkg-trade" src="/assets/img/LokingballEmpty.svg" alt="Seeking">
                            </button>
                        </div>
                        #${pokemon.number}
                    </span>
                    <span class="name">${pokemon.name}</span>
                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>
                        <div class="pokeContainer">
                            <img class="back-img" src="/assets/img/PokeTextBackTilt.png">
                            <img class="poke-photo" src="${pokemon.photo}" alt="${pokemon.name}" data-cry="${pokemon.cries}" data-normal="${pokemon.photo}" data-shiny="${pokemon.photoSh}">

                        </div>
                    </div>
                </li>`;
        }).join('');

        document.getElementById('pokemonList').innerHTML += newHtml;

        // Adicione ouvintes de eventos de clique longo aos elementos Pokémon clicáveis
        document.querySelectorAll('.pokemon-clickable').forEach(pokemonItem => {
            pokemonItem.addEventListener('touchstart', handleLongPress);
            pokemonItem.addEventListener('mousedown', handleLongPress);
            pokemonItem.addEventListener('touchend', handleMouseUp);
            pokemonItem.addEventListener('mouseup', handleMouseUp);
        });



        // Adicionar evento de clique para as imagens de Pokémon
        document.querySelectorAll('.poke-photo').forEach(img => {
            img.addEventListener('click', () => {
                const cryUrl = img.dataset.cry;
                playPokemonCry(cryUrl);
            });
        });

        // Adicione um ouvinte de evento de clique aos botões de coração
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

        document.querySelectorAll('.badge-shiny-button').forEach(button => {
            button.addEventListener('click', () => {
                // Verificar o estado atual do botão
                const currentState = button.getAttribute('data-state');

                // Obter a imagem do pokémon associada ao botão clicado
                const pokemonPhoto = button.closest('.pokemon').querySelector('.poke-photo');

                // Alterar a imagem com base no estado atual do botão
                if (currentState === 'inactive') {
                    button.setAttribute('data-state', 'active');
                    button.querySelector('.badge-shiny').src = "/assets/img/ShinyMarkColored.svg";
                    // Alterar a imagem de poke-photo para a versão brilhante
                    pokemonPhoto.src = pokemonPhoto.dataset.shiny;
                } else {
                    button.setAttribute('data-state', 'inactive');
                    button.querySelector('.badge-shiny').src = "/assets/img/ShinyMarkEmpty.svg";
                    // Voltar a imagem de poke-photo para a versão padrão
                    pokemonPhoto.src = pokemonPhoto.dataset.normal;
                }
            });
        });
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
    });
}


document.querySelectorAll('.poke-photo').forEach(img => {
    img.addEventListener('click', () => {
        const cryUrl = img.dataset.cry;
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

function getBackgroundGradient(types, gradientDirection = 'to top right') {
    if (types.length === 1) {
        return `background-color: var(--${types[0]});`;
    } else if (types.length === 2) {
        return `background: linear-gradient(${gradientDirection}, var(--${types[0]}) 39%, var(--${types[1]}) 70%);`;
    }
    return '';
}




loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;

    const qtdRecordWithNextPage = offset + limit;

    if (qtdRecordWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});


// Função para lidar com o evento de clique longo
function handleLongPress(e) {
    const { currentTarget: target } = e;
    // Extrai o número do Pokémon associado ao elemento clicado
    const pokemonNumber = target.getAttribute('data-number');
    // Define um temporizador para verificar se o clique é um clique longo
    target.longPressTimer = setTimeout(() => {
        // Se o temporizador expirar, executa a ação de clique longo aqui
        // Por exemplo, redirecionar para a página de detalhes
        window.location.href = `detail.html?pokemonNumber=${pokemonNumber}`;
    }, 500); // Ajuste o tempo conforme necessário para o seu caso
}

// Função para lidar com o evento de soltar o clique antes do clique longo
function handleMouseUp(e) {
    const { currentTarget: target } = e;

    // Cancela o temporizador do clique longo
    clearTimeout(target.longPressTimer);
}

// Adicione ouvintes de eventos de clique longo aos elementos Pokémon clicáveis
document.querySelectorAll('.pokemon-clickable').forEach(pokemonItem => {
    pokemonItem.addEventListener('mousedown', handleLongPress);
    pokemonItem.addEventListener('touchstart', handleLongPress);
    pokemonItem.addEventListener('mouseup', handleMouseUp);
    pokemonItem.addEventListener('touchend', handleMouseUp);
});

$(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll >= 40) {               // se rolar 40px ativa o evento
        $("#menu").addClass("ativo");    //coloca a classe "ativo" no id=menu
    } else {
        $("#menu").removeClass("ativo"); //se for menor que 40px retira a classe "ativo" do id=menu
    }
});

function showMenu() {
    const menu = document.querySelector('.menu-options');
    menu.classList.add('active');
}

function hideMenu() {
    const menu = document.querySelector('.menu-options');
    menu.classList.remove('active');
}

function toggleMenu() {
    const menu = document.querySelector('.menu-options');
    menu.classList.toggle('active');
}

