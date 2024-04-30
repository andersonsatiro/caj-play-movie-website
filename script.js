const api_key = '9d65af5d57fca2c19373db5767188390'
const base_URL = 'https://api.themoviedb.org/3/'
const parameters = `api_key=${api_key}&language=pt-BR`
const image_base_URL = 'https://image.tmdb.org/t/p/w500'

const ID_movies_selected_banner = [ '785976', '446159', '755339', '7343']
let banner_movies = []

const APICall = async (url) => {
  try{
    const response = await fetch(url)
    if(!response.ok){
      throw new Error('Erro ao fazer a busca por filmes')
    }
    return response.json()
  } catch(error){
    console.error('Encontramos um erro. Tente novamente', error)
    throw error
  }
}

const renderBannerItem = (movie, index) => {
  return  `
    <li
      style='background-image: url(${image_base_URL}${movie.backdrop_path})'
      class="banner"
      index=${index}
    >
      <main class="movie-description">
        <h1>${movie.title}</h1>

        <section class="banner-movie-details">
          <div class="banner-movie-review">
            <a href="https://www.imdb.com/" target="_blank">
              <img
              src="/assets/imdb.svg"
              alt="Logo do IMDB - base de dados online de informação sobre cinema, TV, música e games"
            >
            </a>
            <span>${movie.vote_average.toFixed(1)} / 10</span>
          </div>

          <div class="banner-movie-category">
            <i class="ph-thin ph-film-slate"></i>
            <span>${movie.genres[0].name}</span>
          </div>
        </section>

        <p>
          Documentário que retrata a vida de Pelé, da busca pela perfeição à condição de mito. Abrangendo um
          extraordinário período de 12 anos, a produção mostra como o único jogador a vencer três Copas do Mundo
          passou de astro do futebol em 1958 a herói nacional em 1970, uma época radical e turbulenta no Brasil.
        </p>
        
        <button>
          <i class="ph-fill ph-play-circle"></i>
          <span>SAIBA MAIS</span>
        </button>
      </main>

      <aside class="pagination-box">
        <div class="movie-options selected-movie">
          <div></div>
          <span>1</span>
        </div>

        <div class="movie-options">
          <span>2</span>
        </div>

        <div class="movie-options">
          <span>3</span>
        </div>

        <div class="movie-options">
          <span>4</span>
        </div>
      </aside>
    </li>
  `
}

const createBannerItems = () => {
  const ul = document.getElementById('list-banner-movies')
  ul.innerHTML = banner_movies.map((movie, index) => renderBannerItem(movie, index))
  .join(' ')
}

Promise.all(ID_movies_selected_banner.map((movieID) => {
  const url = `${base_URL}movie/${movieID}?${parameters}`
  return APICall(url)
}))
.then((data) => {
  banner_movies = data 
  createBannerItems()
})
.catch(error => {console.error("Erro ao buscar dados dos filmes!", error)})