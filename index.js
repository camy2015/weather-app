require("dotenv").config();
const {
  readInput,
  inquirerMenu,
  pause,
  listPlaces,
} = require("./helpers/inquirer");
const Searching = require("./models/searching");

const main = async () => {
  const searchs = new Searching();
  let opt = 0;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        const searchTerm = await readInput("City: ");

        const places = await searchs.city(searchTerm);
        const id = await listPlaces(places);
        if (id === "0") continue;

        const { name, lng, lat } = places.find((place) => place.id === id);

        searchs.addHistory(name);

        const { description, temp, temp_min, temp_max } =
          await searchs.weatherPlace(lat, lng);

        console.clear();
        console.log("\nInformation of the city\n".green);
        console.log("City: ", name.green);
        console.log("Lat: ", lat);
        console.log("Lng:", lng);
        console.log("Temp: ", temp);
        console.log("Min: ", temp_min);
        console.log("Max:", temp_max);
        console.log("Weather state: ", description.green);
        break;

      case 2:
        searchs.historyCapitalized.forEach((place, index) => {
          const idx = `${index + 1}.`.green;
          console.log(`${idx} ${place}`);
        });
        break;
    }

    await pause();
  } while (opt !== 0);
};

main();
