const axios = require('axios');

class Busquedas {
    
    historial = ['Tegucigalpa', 'Madrid', 'San Jose'];

    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
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

}

module.exports = Busquedas;