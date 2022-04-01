const axios = require('axios');

class Busquedas {
    
    historial = [];

    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsWeather(){
        return {
            'units': 'metric',
            'lang': 'es',
            'appid': 'f369635965b00ad16ced5da4da4b9f3b'
        }
    }

    constructor(){
        // ToDo: Leer DB si existe 
    }

    async ciudad( lugar='' ){
        
        try {
            //Peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lon: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error) {
            
            return error;

        }
        
        
        //Peticion http
        console.log('ciudad:',lugar);

        return [];
    }

    async climaLugar(lat,lon){

        try {
            // instance axios
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: { ...this.paramsWeather, lon, lat }
            });
            // resp.data
            const resp = await instance.get();
            //console.log(resp.data.features);

            return {
                desc: resp.data.weather[0].description,
                min:  resp.data.main.temp_min,
                max:  resp.data.main.temp_max,
                temp: resp.data.main.temp
            };
        } catch (error) {
            console.log(error);
        }
    }

    guardarHistorial(lugar=''){
        // ToDo: Prevenir guardados
        if(!this.historial.includes(lugar.toLocaleLowerCase()))
            this.historial.unshift(lugar);
    }

}

module.exports = Busquedas;