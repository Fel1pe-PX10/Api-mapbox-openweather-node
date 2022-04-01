// Importaciones nativas
const fs = require('fs');

// Importaciones de terceros
const axios = require('axios');
const { urlToHttpOptions } = require('url');

class Busquedas {
    
    historial = [];
    dbPath = './db/database.json';

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

    get historialCapitalizado(){
        return this.historial.map(busqueda => {
            
            let palabras = busqueda.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1))

            return palabras.join(' ');
        });
    }

    constructor(){
        this.leerDb();
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
        if(!this.historial.includes(lugar.toLocaleLowerCase())){
            this.historial.unshift(lugar.toLocaleLowerCase());

            this.historial = this.historial.splice(0, 5);

            // Guarar DB
            this.guardarDb();
        }
            

    }

    guardarDb(){

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDb(){
        if( !fs.existsSync(this.dbPath) )
        return null;

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);

        this.historial = data.historial;
    }

}

module.exports = Busquedas;