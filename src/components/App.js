import React from 'react';
import SearchBar from './Search'
import Movies from './Movie'
import axios from 'axios'
import AddMovie from './AddMovie'
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

class App extends React.Component {

    state = {
        movies: [],

        searchQuery: ''

    }

    async componentDidMount() {
        const response = await axios.get("http://localhost:3002/movies")
        this.setState({ movies: response.data })
    }


    deleteMovie = (movie) => {
        const newMovies = this.state.movies.filter(
            m => m.id !== movie.id
        );

        this.setState({
            movies: newMovies
        })
    }


    searchMovie = (event) => {
        this.setState({ searchQuery: event.target.value })

    }

    addMovie = async (movie) => {
        await axios.post('http://localhost:3002/movies/', movie)
        this.setState(state => ({
            movies:state.movies.concat([movie])
        }))
    }

    render() {

        let filteredMovies = this.state.movies.filter(
            (movie) => {
                return movie.name.toLowerCase().indexOf(this.state.searchQuery.toLowerCase()) !== -1
            }
        ).sort( (a, b) => {
            return a.id < b.id ? 1: a.id > b.id ? -1 : 0;
        });

        return (
            <Router>
                <div className='container'>

                    <Switch>
                        <Route path="/" exact render={() => (
                            <React.Fragment>
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        <SearchBar searchMovieProp={this.searchMovie} />
                                    </div>
                                </div>
                                <Movies
                                    movies={filteredMovies}
                                    deleteMovieProp={this.deleteMovie} />
                            </React.Fragment>
                        )}>

                        </Route>
                    </Switch>
                    <Route path="/add" exact render={({history}) => (
                        <AddMovie 

                        onAddMovie = {(movie)  => {this.addMovie(movie)
                        history.push("/")
                        }}

                        
                        />
                    )}>

                </Route>
                </div>
            </Router>
        )
    }

}


export default App