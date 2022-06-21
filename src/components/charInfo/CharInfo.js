import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import './charInfo.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import { Link } from 'react-router-dom';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);

    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line
    }, [props.charId]);

    const updateChar = () => {
        const {charId} = props;
        if(!charId) {
            return;
        };
        
        clearError();
        getCharacter(charId)
            .then(onCharLoaded);
    };

    const onCharLoaded = (char) => {
        setChar(char);
    };

    const skeleton =  char || loading || error ? null : <Skeleton/>;
    const spinner = loading === true ? <Spinner/> : null;
    const errorMessage = error === true ? <ErrorMessage/> : null;
    const content = !(loading || error || !char) ? <View char = {char}/> : null;

    return (
        <div className="char__info">
            {skeleton}
            {spinner}
            {errorMessage}
            {content}
        </div>
    );
};

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    
    let imgStyle = {'objectFit' : 'cover'};
    if(thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    };
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">Homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length ? null : 'There is no comics with this character'}
                {comics.slice(0, 10).map((item, i) => {
                    return (
                        <li className="char__comics-item" key={i}>
                            <Link to={`/comics/${item.resourceURI.match(/\d\d+/g)}`}>
                                {item.name}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </>
    );
};

CharInfo.propTypes = {
    charId: PropTypes.number
};

export default CharInfo;