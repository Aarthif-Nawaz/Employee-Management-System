import React, {Component} from 'react';
import './Footer.css';
// import { Map, GoogleApiWrapper } from 'google-maps-react';

const mapStyles = {
    width: '260px',
    height: '260px'
  };

  class Footer extends Component {
    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
      }

    componentWillUnmount(){
        this._isMounted = false;
      }
    

    render() {
        return (
            <footer>
                <div className="right-align map-loc">
                {/* {console.log('map')}
                    <Map
                            google={this.props.google}
                            zoom={14}
                            style={mapStyles}
                            initialCenter={{
                            lat: 33.925697,
                            lng: -84.380094
                            }}
                        /> */}
                </div> 
                <div className="footer-txt">
                        <p>Final project In georgia Tech Global Learning Center</p>
                        <p> Employee Management system MERN Application </p>
                        <p>by: <strong>Maryam keshavarz</strong> </p>
                        <h4>Instuctors: </h4>
                        <p><a href="https://github.com/hannahpatellis">Hannah Patellis</a></p>
                        <p><a href="https://github.com/CjJordan">Cj Jordan</a></p> 
                    </div>
            </footer>
        )
    }
  }

  export default /*GoogleApiWrapper({
    apiKey: 'AIzaSyD0KXmC5gFadBpK5eQEdAuzTW4PJvoKiw4'
  })*/(Footer);

