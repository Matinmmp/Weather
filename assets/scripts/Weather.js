class Waether {
    constructor(obj) {
        this.weatherObject = {
            temp: obj.temp,
            weather: obj.weather,
            location: obj.location,
            feelsLike: obj.feelsLike,
            humidity: obj = obj.humidity,
            img: 'cloudy-day-3.svg'
        }
    }

    getWeatherObject() {
        if (this.weatherObject.weather.toLocaleLowerCase().includes("cloud"))
            this.weatherObject.img = "cloud.svg";
        else if (this.weatherObject.weather.toLocaleLowerCase().includes("clear"))
            this.weatherObject.img = "clear.svg";
        else if (this.weatherObject.weather.toLocaleLowerCase().includes("snow"))
            this.weatherObject.img = "snow.svg";
        else if (this.weatherObject.weather.toLocaleLowerCase().includes("rain"))
            this.weatherObject.img = "rain.svg";

        return this.weatherObject
    }
}


export default Waether;