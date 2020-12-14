import React from 'react';
// require('dotenv').config();

type AcceptedProps = {
  optionalProp?: string;
};

type WeatherState = {
  loc: {
    lat: number | string | undefined;
    lon: number | string | undefined;
  };
  city: string;
  tempC: number | string;
  tempF: number | string;
  icon: any;
  sunrise: any;
  sunset: any;
  errorMessage: string;
};


  // type CordOptions = {
  //     enableHighAccuracy: boolean;
  //     timeout: number;
  //     maximumAge: 0;
  // }

//use your own key
const key: string = '7c2e22a812496ad819bd8939424d868d';

class Weather extends React.Component<AcceptedProps, WeatherState> {
  constructor(props: AcceptedProps) {
    super(props);
    this.state = {
      loc: {
        lat: 0,
        lon: 0,
      },
      city: '',
      tempC: 0,
      tempF: 0,
      icon: undefined,
      sunrise: undefined,
      sunset: undefined,
      errorMessage: 'Opps! We do not know where you are',
    };
  }

  // componentDidMount() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(position => {
  //       this.setState({ lat: position.coords.latitude });
  //       this.setState({ lon: position.coords.longitude });
  //       console.log('lat', this.state.lat);
  //       console.log('lon', this.state.lon);
  //     });
  //   } else {
  //     console.log('your browser does not support geolocation');
  //   }
  // }

  //getPosition isn't properly running
  getPosition: any = () => {
    console.log('getPostion fired -- ');
    //this doesn't work below

    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(position => {
    //     this.setState({
    //       loc: {
    //         lat: position.coords.latitude,
    //         lon: position.coords.longitude,
    //       },
    //     });
    //     console.log('did this work????');
    //     console.log('lat', this.state.loc.lat);
    //     console.log('lon', this.state.loc.lon);
    //   });
    // } else {
    //   console.log('your browser does not support geolocation');
    // }
    //but this works below
    console.log('and after....');
    return new Promise((resolve: any, reject: any) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  getWeather = async (lat: number, lon: number) => {
    console.log('getWeather fired');
    const api_call = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
    );
    console.log(api_call);
    const data = await api_call.json();
    console.log(data);
    this.setState({
      loc: {
        lat: 0,
        lon: 0,
      },
      city: data.name,
      tempC: Math.round(data.main.temp),
      tempF: Math.round(data.main.temp * 1.8 + 32),
      icon: data.weather[0].icon,
      sunrise: undefined,
      sunset: undefined,
      errorMessage: 'Sorry, We can not find you!',
    });
  };



  success(pos: any){
    let cord: any = pos.coords;
    console.log('Your current position is:')
    console.log(`lat is: ${cord.latitude}`)
  console.log(`cord is: ${cord.longitude}`)
  }

  error(err: any){
    console.warn(`ERROR(${err.code}): ${err.message}`)
  }

  componentDidMount() {
  let options = {
    enableHighAcuraacy: true,
    timeout: 5000,
    maximumAge: 0
  }
    console.log('mounted');
    if('geolocation' in navigator){
      //worked
      console.log('Available');
      console.log(navigator)
      console.log(navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this.success, this.error, options)
    } else {
      console.log('not available')
    }
    console.log('end of geolocation')

    this.getPosition()
      .then((position: any) => {
        console.log('right before we call getWeather');
        this.getWeather(position.coords.latitude, position.coords.longitude);
      })
      .catch((err: any) => {
        this.setState({ errorMessage: err.message });
      });
  }

  render() {
    //const { city, tempC, tempF, icon, sunrise, sunset } = this.state;
    const { city, tempC, tempF, icon } = this.state;
    return (
      <div className="Weather">
        <div className="weather-container">
          <div>Location: {city}</div>
          <div className="weather-item">
            {tempC} &deg;C <span className="slash">/</span>
            {tempF} &deg;F
          </div>
          <div>
            <img
              className="weather-icon"
              src={`http://openweathermap.org/img/w/${icon}.png`}
              alt="weather icon"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Weather;
