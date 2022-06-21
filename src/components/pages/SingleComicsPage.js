import { useEffect, useState } from 'react';
import { useParams ,Link } from 'react-router-dom';

import './singleComicsPage.scss';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';


const SingleComicsPage = () => {

    const {comicId} = useParams();
    
    const [comic, setComic] = useState({});

    const {loading, error, getComic, clearError} = useMarvelService();

    useEffect(() => {
        updateComic();

        // eslint-disable-next-line
    }, [comicId]);

    const updateComic = () => {
        clearError();
        getComic(comicId)
            .then(onComicLoaded);
    };

    const onComicLoaded = (comic) => {
        setComic(comic);
    };

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(errorMessage || spinner || !comic) ? <View comic={comic}/> : null;
    
    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    );
};

const View = ({comic}) => {
    const {description, language, pageCount, price, thumbnail, title} = comic;

    return (
        
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description ? description : 'There is no desctiption'}</p>
                <p className="single-comic__descr">{pageCount ? `${pageCount} p.` : 'No information about the number of pages'} </p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price ? `${price}$` : 'not available'}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    );
};

export default SingleComicsPage;