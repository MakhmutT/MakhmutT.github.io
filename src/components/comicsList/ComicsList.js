import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './comicsList.scss';

const ComicsList = () => {
    const [comics, setComics] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(8);
    const [comicEnded, setComicEnded] = useState(false)

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, false);
        // eslint-disable-next-line
    }, []);

    const onRequest = (offset, initial) => {
        setNewItemLoading(initial)
        getAllComics(offset)
            .then(onComicsListLoaded);
    };
    
    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if(newComicsList.length < 8) {
            ended = true
        }

        setComics([...comics, ...newComicsList]);
        setOffset(offset => offset + 8);
        setNewItemLoading(false)
        setComicEnded(ended)
    };

    const renderItems = (arr) => {
        const items = arr.map((item, i) => {
            return (
                <li key={i} className="comics__item">
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price ? `${item.price}$` : 'NOT AVAILABLE'}</div>
                    </Link>
                </li>
            );
        });
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        );
    };

    const items = renderItems(comics);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null


    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                style={{display: comicEnded ? 'none' : 'block'}}
                disabled={newItemLoading}
                onClick={() => onRequest(offset, true)} 
                className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    );
};
export default ComicsList;