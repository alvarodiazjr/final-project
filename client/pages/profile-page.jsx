import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

export default class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latLng: [],
      rideLogs: [],
      bikeInfo: [],
      isClicked: null
    };
    this.tabClick = this.tabClick.bind(this);
  }

  componentDidMount() {
    fetch('/api/coords')
      .then(res => res.json())
      .then(result => {
        this.setState({ latLng: result });
      })
      .catch(err => console.error(err));
    fetch('/api/ridelogs')
      .then(res => res.json())
      .then(result => {
        this.setState({ rideLogs: result });
      })
      .catch(err => console.error(err));
    fetch('/api/getbikes')
      .then(res => res.json())
      .then(result => {
        this.setState({ bikeInfo: result });
      })
      .catch(err => console.error(err));
  }

  tabClick(event) {
    const clickedTab = event.target.getAttribute('id');
    if (clickedTab === this.state.isClicked) {
      this.setState({ isClicked: null });
    } else {
      this.setState({ isClicked: clickedTab });
    }
  }

  render() {
    const containerStyle = {
      width: '100%',
      height: '400px',
      border: '1.5px solid black'
    };

    const center = {
      lat: 39,
      lng: -95
    };

    return (
      <div className="container">
        <h1 className='profile-content'>alvarodiazjr</h1>
        <div className='profile-page'>
          <div className='profile-content'>
            <div onClick={this.tabClick} id='bikes' className="blocks header">My Bikes</div>
            {
              this.state.bikeInfo.map(bikeInfo => {
                const bikeDisplay = this.state.isClicked === 'bikes'
                  ? 'visible'
                  : 'hidden';
                return (
                  <div className='locations' key={bikeInfo.bikeId}>
                    <div className={`blocks content ${bikeDisplay}`}>
                      {bikeInfo.year} {bikeInfo.make} {bikeInfo.model}
                    </div>
                  </div>
                );
              })
            }
            <div onClick={this.tabClick} id='rides' className="blocks header">My Rides</div>
            {
              this.state.rideLogs.map(rideLogs => {
                return (
                  <div key={rideLogs.logId}>
                    <FullLog rideLogs={rideLogs} display={this.state.isClicked}/>
                  </div>
                );
              })
            }
          </div>
          <div className='profile-content'>
            <div className="row">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={3}
              >
                {this.state.latLng.map(marker => (
                  <Marker
                    position={{ lat: marker.lat, lng: marker.lng }}
                    key={marker.logId}
                  />
                ))}
              </GoogleMap>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function FullLog(props) {
  const { logId, location } = props.rideLogs;
  const display = props.display;
  const rideDisplay = display === 'rides'
    ? 'visible'
    : 'hidden';
  return (
    <a className='locations' key={logId} href={`#fulllog?logId=${logId}`}>
      <div className={`blocks content ${rideDisplay}`}>{location}</div>
    </a>
  );
}
