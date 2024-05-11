const api_key = '9d65af5d57fca2c19373db5767188390'
const base_URL = 'https://api.themoviedb.org/3/'
const parameters = `api_key=${api_key}&language=pt-BR`
const image_base_URL = 'https://image.tmdb.org/t/p/w500'

const ID_movies_selected_banner = [ '785976', '446159', '755339', '7343']
let banner_movies = []
let favorite_category_movies = []

const movie_sessions = [
  {
    header: {
      icon_class: "ph ph-fire",
      title: "Em alta no mundo",
      color_one: "#2203FF",
      color_two: "#C40D60",
      color_three: "",
    },
  },
  {
    header: {
      icon_class: "ph ph-island",
      title: "Da terra do cajú",
      color_one: "#002776",
      color_two: "#009C3B",
      color_three: "#FFDF00",
    },
  }, 
  {
    header: {
      icon_class: "ph ph-monitor-play",
      title: "Da cajúplay para você",
      color_one: "#2203FF",
      color_two: "#C40D60",
      color_three: "",
    },
  }
]

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

const changeBannerMovie = (movie_number) => {
  movie_number--
  const list_items = document.getElementsByClassName('banner') 

  
  for(let i = 0; i < list_items.length; i++){
    const li = list_items[i]
    const item_index = li.getAttribute('index')

    if(item_index == movie_number){
      li.style.display = ''
    } else {
      li.style.display = 'none'
    }

    for(let j = 0; j < list_items.length; j++){
      const parent_div = document.getElementsByClassName(`banner${j + 1}`)

      const div = document.createElement('div')
    
      j == movie_number
        ? (
          parent_div[j].classList.add('selected-movie'),
          parent_div[j].insertBefore(div, parent_div[j].firstChild)
        )
        : (
          parent_div[j].classList.remove('selected-movie'),
          div.remove() 
        )      
    }
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
          ${movie.overview}
        </p>
        
        <button>
          <i class="ph-fill ph-play-circle"></i>
          <span>SAIBA MAIS</span>
        </button>
      </main>

      <aside class="pagination-box">
        <div class="movie-options banner1">
          <span onclick="changeBannerMovie(1)">1</span>
        </div>

        <div class="movie-options banner2">
          <span onclick="changeBannerMovie(2)">2</span>
        </div>

        <div class="movie-options banner3">
          <span onclick="changeBannerMovie(3)">3</span>
        </div>

        <div class="movie-options banner4">
          <span onclick="changeBannerMovie(4)">4</span>
        </div>
      </aside>

      <div class="banner-overlay"></div>
    </li>
  `
}

const createBannerItems = () => {
  const ul = document.getElementById('list-banner-movies')
  ul.innerHTML = banner_movies.map((movie, index) => renderBannerItem(movie, index))
  .join(' ')
  changeBannerMovie(1)
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

const renderCategoryMovieCard = ({name}) => {
  return `
    <li>
    <span></span>

    <main>
      <i class="ph-thin ph-popcorn"></i>
      <h3>${name.toLowerCase()}</h3>
    </main>

    <p>tem no <strong>cajú</strong>play</p>
    </li>
  `
}

APICall(`${base_URL}genre/movie/list?${parameters}`).then(({genres}) => {
  favorite_category_movies = genres
  const ul = document.getElementById('movie-categorie-list')
  ul.innerHTML = favorite_category_movies.map((gender) => renderCategoryMovieCard(gender))
  .join('')
})

const createMovieScrollHandler = () => {
  let current_index = 0;

  return(ulID, direction) => {
    const list_movies = document.querySelectorAll(`#${ulID} li`)
    const li_width = list_movies[0].offsetWidth + 32

    const screen_width = window.innerWidth
    let number_visible_movies = 4

    screen_width < 1000 && (number_visible_movies = 3)
    screen_width < 820 && (number_visible_movies = 2)
    screen_width < 630 && (number_visible_movies = 1)
    
    direction === "next"
      ? current_index++
      : current_index--

    current_index = Math.min(
      Math.max(current_index, 0),
      Math.floor(list_movies.length / number_visible_movies)
    )

    const translateValue = -(current_index * number_visible_movies) * li_width;
    for(let i = 0; i < list_movies.length; i++){
      list_movies[i].style.transform = `translateX(${translateValue}px)`;
    }  
  }
}

const handleMovieScrolling1 = createMovieScrollHandler();

const next_category_list = document.getElementById('next-category')
next_category_list.addEventListener('click',
  () => handleMovieScrolling1("movie-categorie-list", "next")
)

const prev_category_list = document.getElementById('prev-category')
prev_category_list.addEventListener('click',
  () => handleMovieScrolling1("movie-categorie-list", "prev")
)

