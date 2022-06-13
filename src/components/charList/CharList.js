import {Component} from 'react'
import PropTypes from 'prop-types'
import './charList.scss';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

class CharList extends Component {
    state = {
        charsList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 300,
        charEnded: false
    };

    onCharsListLoaded = (newCharsList) => {
        let ended = false;
        if(newCharsList.length < 9) {
            ended = true
        }
        
        this.setState(({charsList, offset}) => (
            {
                charsList: [...charsList, ...newCharsList],
                loading: false,
                newItemLoading: false,
                offset: offset + 9,
                charEnded: ended
            }
        ));
    };

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    };

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    };

    marvelService = new MarvelService();

    componentDidMount = () => {
        this.onRequest();
    };

    onRequest = (offset) => {
        this.onCharListLoading()
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharsListLoaded)
            .catch(this.onError);
    };

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderItems = (arr) => {
        const items = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if(item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            };
            return <li 
                        className="char__item" 
                        key={item.id} 
                        tabIndex={0}
                        ref={this.setRef}
                        onClick={() => {
                            this.props.onCharSelected(item.id); 
                            this.focusOnItem(i)
                        }}>
                        <img src={item.thumbnail} style={imgStyle} alt={item.name}/>
                        <div className="char__name">{item.name}</div>
                    </li>
        });
        return (
            <ul className="char__grid">
                {items}
            </ul>
        );
    };

    render() {
        const {charsList, loading, error, newItemLoading, offset, charEnded} = this.state;

        const items = this.renderItems(charsList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;


        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    disabled={newItemLoading}
                    onClick={() => this.onRequest(offset)}
                    style={{display: charEnded ? 'none' : 'block'}}
                    className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        );
    };
};

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;