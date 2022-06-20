import {useHttp} from '../hooks/http.hook'

const useMarvelService = () => {

  const {loading, request, error, clearError} = useHttp()

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKey = 'apikey=4f7d6731dec5d140656549c75521fad3';
  const _baseOffset = 300;
  const _baseComicsOffset = 8

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  };
  
  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
      thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items
    };
  };

  const getAllComics = async (offset = _baseComicsOffset) => {
    const res = await request(`${_apiBase}comics?issueNumber=1&limit=8&offset=${offset}&${_apiKey}`)
    return res.data.results.map(_transformComics)
  }

  const getComic = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`)
    return _transformComics(res.data.results[0])
  }

  const _transformComics = (comic) => {
    return {
      id: comic.id,
      title: comic.title,
      description: comic.description,
      pageCount: comic.pageCount,
      thumbnail: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
      language: comic.textObjects.language || 'en-us',
      price: comic.prices[0].price,
    }
  }

  return {loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComic}
};

export default useMarvelService;