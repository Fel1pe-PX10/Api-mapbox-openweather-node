require('dotenv').config();

const { leerInput, inquireMenu, pausaMenu, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {
    
    const busquedas = new Busquedas();

    const baseDatos = busquedas.leerDb();
    // await pausaMenu();


    let opt = 0;
    
    do {
        opt = await inquireMenu();
        parseInt(opt);

        switch (opt) {
            case 1:
                // Mostrar mensaje
                const termino = await leerInput('Ciudad: ');

                // Buscar los lugares
                const lugares = await busquedas.ciudad(termino);

                // Seleccionar lugar
                const ciudadId = await listarLugares(lugares);
                if(ciudadId === '0') continue;
                const lugarSelec = lugares.find(l => l.id === ciudadId);

                // Guardar en DB
                busquedas.guardarHistorial(lugarSelec.nombre);

                // Obtener clima
                const clima = await busquedas.climaLugar(lugarSelec.lat, lugarSelec.lon);
                //console.log({clima});

                // Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log(`Ciudad: ${lugarSelec.nombre}`);
                console.log(`Lat: ${lugarSelec.lat}`);
                console.log(`Lon: ${lugarSelec.lon}`);
                console.log(`Temperatura: ${clima.temp}`);
                console.log(`Mínima: ${clima.min}`);
                console.log(`Máxima: ${clima.max}`);
                console.log(`Como está el clima: ${clima.desc}`);
                await pausaMenu();
                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                });
                await pausaMenu();
                break;
        }
        
    } while (opt !== 0);
}

main();