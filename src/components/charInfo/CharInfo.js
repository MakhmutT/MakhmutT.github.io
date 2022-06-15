import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import './charInfo.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false);
    };

    const onCharLoading = () => {
        setLoading(false);
    };

    const onError = () => {
        setLoading(false);
        setError(true);
    };

    const marvelService = new MarvelService();

    const updateChar = () => {
        const {charId} = props;
        console.log(props.charId)

        if(!charId) {
            return;
        };

        onCharLoading()
        marvelService.getCharacter(charId)
            .then(onCharLoaded)
            .catch(onError);
    };

    useEffect(() => {
        updateChar();
    }, [props.charId]);

    const skeleton =  char || loading || error ? null : <Skeleton/>
    const spinner = loading === true ? <Spinner/> : null
    const errorMessage = error === true ? <ErrorMessage/> : null
    const content = !(loading || error || !char) ? <View char = {char}/> : null

    return (
        <div className="char__info">
            {skeleton}
            {spinner}
            {errorMessage}
            {content}
        </div>
    )
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    
    let imgStyle = {'objectFit' : 'cover'};
    if(thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }
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
                            {item.name}
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;