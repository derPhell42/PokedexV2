function formatNumber(number) {
    return String(number).padStart(3, '0');
}

const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = formatNumber(pokeDetail.id)
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

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

    return pokemon;
}


pokeApi.getPokemonsDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)

}



pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonsDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonDetails) => pokemonDetails)

}



// https://pokeapi.co/api/v2/pokemon-species/bulbasaur
// "has_gender_differences": false,

// "egg_groups": [
//     {
//       "name": "monster",
//       "url": "https://pokeapi.co/api/v2/egg-group/1/"
//     },
// ]
//     {
//       "name": "plant",
//       "url": "https://pokeapi.co/api/v2/egg-group/7/"

//       "base_happiness": 50,
//   "capture_rate": 45,
//   "color": {
//     "name": "green",
//     "url": "https://pokeapi.co/api/v2/pokemon-color/5/"

//     "evolution_chain": {
//         "url": "https://pokeapi.co/api/v2/evolution-chain/1/"
//       },
//       "evolves_from_species": null,
//       "flavor_text_entries": [