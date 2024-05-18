const api_key = process.env.API_KEY
const base_URL = 'https://api.themoviedb.org/3/'
const parameters = `api_key=${api_key}&language=pt-BR`
const image_base_URL = 'https://image.tmdb.org/t/p/w500'
const github_token = process.env.GITHUB_TOKEN

const ID_movies_selected_banner = [ '785976', '446159', '755339', '7343']
let banner_movies = []
let favorite_category_movies = []

const movie_sections = [
  {
    header: {
      class: "trending-movies-section",
      ul_ID: "trending-movies-list",
      ul_class: "list-of-movies",
      button_prev: "prev-trending",
      button_next: "next-trending",
      icon_class: "ph ph-fire fire",
      title: "Em alta no mundo",
      color_one: "#2203FF",
      color_two: "#C40D60",
      color_three: "",
      URL_request: `${base_URL}movie/popular?${parameters}`,
    },
  },
  {
    header: {
      class: "brazilian-movies-section",
      ul_ID: "brazilian-movies-list",
      ul_class: "list-of-movies",
      button_prev: "prev-brazilian",
      button_next: "next-brazilian",
      icon_class: "ph ph-island island",
      title: "Da terra do cajú",
      color_one: "#002776",
      color_two: "#009C3B",
      color_three: "#FFDF00",
      URL_request: `${base_URL}discover/movie?${parameters}&with_original_language=pt&region=BR`,
    },
  }, 
  {
    header: {
      class: "movies-section-for-you",
      ul_ID: "movies-for-you-list",
      ul_class: "list-of-movies",
      button_prev: "prev-for-you",
      button_next: "next-for-you",
      icon_class: "ph ph-monitor-play monitor-play",
      title: "Da cajúplay para você",
      color_one: "#2203FF",
      color_two: "#C40D60",
      color_three: "",
      URL_request: `${base_URL}discover/movie?${parameters}&with_genres=99`,
    },
  }
]

const APICall = async (url) => {
  try{
    const response = await fetch(url)
    if(!response.ok){
      throw new Error('Erro ao fazer a busca')
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
              src="/src/assets/imdb.svg"
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

const renderMainSections = ({header}) => {
  const hr_gradient = header.color_three !== ""
    ? `background-image: linear-gradient(to right, ${header.color_one}, ${header.color_two}, ${header.color_three})`
    : ''

  return `
    <section class="${header.class}">
      <header>
        <i
          class="${header.icon_class}"
          style="color: ${header.color_two}"
        >
        </i>

        <h2>${header.title}</h2>

        <hr style="${hr_gradient}">
        
        <a>
          <p>ver mais</p>
          <i class="ph ph-caret-right"></i>
        </a>
      </header>
      
      <div class="movie-section-main-content">
        <i
          id="${header.button_prev}"
          class="ph ph-caret-left"
        >
        </i>

        <ul id="${header.ul_ID}" class="${header.ul_class}">
        </ul>

        <i
          id="${header.button_next}"
          class="ph ph-caret-right"
        >
        </i>
      </div>
    </section>
  `
}

const table = {
  "01": "janeiro",
  "02": "fevereiro",
  "03": "março",
  "04": "abril",
  "05": "maio",
  "06": "junho",
  "07": "julho",
  "08": "agosto",
  "09": "setembro",
  "10": "outubro",
  "11": "novembro",
  "12": "dezembro"
}

const reorderingReleaseData = (date) => {
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio',
  'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

  const year = date.slice(0,4)
  const month = months[parseInt(date.slice(5,7), 10) - 1]

  return `${month} de ${year}`
}

const renderMovieListItems = (movie) => {
  return `
    <li>
      <div class="poster">
        <img
          src="${image_base_URL}${movie.poster_path}"
          alt="poster do filme ${movie.title}"       
        />
      </div>

      <section>
        <time datetime="${movie.release_date}">
          Lançado em ${reorderingReleaseData(movie.release_date)}
        </time>

        <h3>${movie.title}</h3>

        <p>
          ${movie.overview.slice(0, 100)}...
          <a id="continue-reading" href="https://example.com/" target="_blank">ler mais</a> 
        </p>


        <div class="movie-review">
          <img
            src="/src/assets/imdb.svg"
            alt="Logo do IMDB - base de dados online de informação sobre cinema, TV, música e games"
          >
        
          <span>${movie.vote_average.toFixed(1)} / 10</span>
        </div>
      </section>
    </li>
  `
}

let main = document.getElementById('movie-sections')
main.innerHTML += movie_sections.map(section => renderMainSections(section)).join(' ')

movie_sections.map(({header}) => {
  const ul = document.getElementById(header.ul_ID)

  APICall(header.URL_request)
  .then(({ results }) => {
    const movies_with_description = results.filter((movie) => movie.overview !== "") 
    ul.innerHTML = movies_with_description.map((movie) => renderMovieListItems(movie)).join('')
  })
})

const setNumberMoviesPerScroll = (length) => {

  return number_of_movies
}

const createMovieScrollHandler = () => {
  let current_index = 0;

  return(ulID, direction) => {
    const list_movies = document.querySelectorAll(`#${ulID} li`)
    const li_width = list_movies[0].offsetWidth + 32

    let number_visible_movies = 5
    const screen_width = window.innerWidth
    
    screen_width < 1450 && (number_visible_movies = 4)
    screen_width < 980 && (number_visible_movies = 3)
    screen_width < 750 && (number_visible_movies = 2)
    screen_width < 530 && (number_visible_movies = 1)

    direction === "next"
      ? current_index++
      : current_index--

    current_index = Math.min(
      Math.max(current_index, 0),
      Math.floor(list_movies.length / number_visible_movies)
    )

    if(current_index >= list_movies.length / number_visible_movies){
      return
    }

    const translateValue = -(current_index * number_visible_movies) * li_width;
    for(let i = 0; i < list_movies.length; i++){
      list_movies[i].style.transform = `translateX(${translateValue}px)`;
    }  
  }
}

const preferredCategoryScroll  = createMovieScrollHandler();
const trendingCategoryScroll = createMovieScrollHandler();
const categoryScrollFromBrazil = createMovieScrollHandler();
const categoryScrollForYou = createMovieScrollHandler();

const next_category_list = document.getElementById('next-category')
next_category_list.addEventListener('click',
  () => preferredCategoryScroll("movie-categorie-list", "next")
)

const prev_category_list = document.getElementById('prev-category')
prev_category_list.addEventListener('click',
  () => preferredCategoryScroll("movie-categorie-list", "prev")
)

movie_sections.map(({header}, index) => {
  document.getElementById(header.button_next).addEventListener('click',
    () => {
      switch (index) {
        case 0:
          trendingCategoryScroll("trending-movies-list", "next")
          break;
        case 1:
          categoryScrollFromBrazil("brazilian-movies-list", "next")
          break;
        case 2:
          categoryScrollForYou("movies-for-you-list", "next")
          break;
        default:
          break;
      }
    } 
  )

  document.getElementById(header.button_prev).addEventListener('click',
  () => {
    switch (index) {
      case 0:
        trendingCategoryScroll("trending-movies-list", "prev")
        break;
      case 1:
        categoryScrollFromBrazil("brazilian-movies-list", "prev")
        break;
      case 2:
        categoryScrollForYou("movies-for-you-list", "prev")
        break;
      default:
        break;
    }
  } 
)
})

const callToGithubAPI = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${github_token}`
      }
    })

    if(!response.ok){
      throw new Error('Erro ao fazer a busca')
    }

    return response.json()

  } catch(error){
    console.error("Encontramos um erro ao buscar dados na API do Github", error)
    throw error
  }
  
}

callToGithubAPI('https://api.github.com/users/andersonsatiro').then(data => {
  const user_description = document.getElementById('user-description')
  user_description.innerHTML += data.bio

  const user_photo = document.getElementById('user-photo')
  user_photo.setAttribute('src', data.avatar_url)
})

callToGithubAPI('https://api.github.com/repos/andersonsatiro/cajuplay-movie-website').then(data => {

  const creation_date = document.getElementById('repo-creation-date')
  creation_date.textContent = reorderingReleaseData(data.created_at)

  const visibility = document.getElementById('repo-visibility')
  visibility.textContent = data.visibility === "public" ? "público" : "privado"

  const repo_name = document.getElementById('repo-name')
  repo_name.textContent = data.full_name
  repo_name.setAttribute('href', `https://github.com/${data.full_name}`)

  const repo_language = document.getElementById('repo-language')
  repo_language.textContent = data.language

  const last_update = document.getElementById('repo-last-update')
  last_update.textContent = reorderingReleaseData(data.updated_at)

  const link_to_github = document.getElementById('link-to-github')
  link_to_github.setAttribute('href', data.owner.html_url)
})