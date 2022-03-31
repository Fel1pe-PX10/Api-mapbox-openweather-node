require('dotenv').config();

const { leerInput, inquireMenu, pausaMenu, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {
    
    const busquedas = new Busquedas();
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
                const lugarSelec = lugares.find(l => l.id === ciudadId);

                // Obtener clima


                // Mostrar resultados
                console.log('\nInformación de la ciudad\n'.green);
                console.log(`Ciudad: ${lugarSelec.nombre}`);
                console.log(`Lat: ${lugarSelec.lat}`);
                console.log(`Lon: ${lugarSelec.lon}`);
                console.log(`Temperatura:`);
                console.log(`Mínima:`);
                console.log(`Máxima:`);
                await pausaMenu();
                break;
            case 2:
                console.log(`Opcion ${opt}`);
                await pausaMenu();
                break;
        }
        
    } while (opt !== 0);
}

main();