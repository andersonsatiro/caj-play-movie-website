require('dotenv').config()

const base_URL = 'https://api.themoviedb.org/3/'
const parameters = `api_key=${process.env.API_KEY}&language=pt-BR`

const ID_movies_selected_banner = [ '755339', '446159', '1056212', '7343', '40096', '227932', '785976',]
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

Promise.all(ID_movies_selected_banner.map((movieID) => {
  const url = `${base_URL}movie/${movieID}?${parameters}`
  return APICall(url)
}))
.then(data => banner_movies = data)
.catch(error => {console.error("Erro ao buscar dados dos filmes!", error)})