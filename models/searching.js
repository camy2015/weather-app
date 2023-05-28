const fs = require("fs");
const { default: axios } = require("axios");

class Searching {
  history = [];
  dbPath = "./db/database.json";

  constructor() {
    this.readDB();
  }

  get paramsMapBox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  get paramsOpenWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
      lang: "es",
    };
  }

  get historyCapitalized() {
    return this.history.map((place) => {
      let words = place.split(" ");
      words = words.map((w) => w[0].toUpperCase() + w.substring(1));

      return words.join(" ");
    });
  }

  async city(place = "") {
    try {
      const instance = axios.create({
        baseURL: `${process.env.BASE_URL_APIMAPBOX}/${place}.json`,
        params: this.paramsMapBox,
      });

      const resp = await instance.get();

      return resp.data.features.map((place) => ({
        id: place.id,
        name: place.place_name_es,
        lng: place.center[0],
        lat: place.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async weatherPlace(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: `${process.env.BASE_URL_APIWEATHER}`,
        params: { ...this.paramsOpenWeather, lat, lon },
      });

      const resp = await instance.get();
      const { weather, main } = resp.data;
      const [{ description }] = weather;
      const { temp_min, temp_max, temp } = main;

      return {
        description,
        temp,
        temp_min,
        temp_max,
      };
    } catch (error) {
      console.log(error);
    }
  }

  addHistory(place = "") {
    if (this.history.includes(place.toLowerCase())) {
      return;
    }

    this.history = this.history.splice(0, 4);

    this.history.unshift(place);

    this.saveDB();
  }

  saveDB() {
    const payload = {
      history: this.history,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readDB() {
    if (!fs.existsSync(this.dbPath)) {
      return;
    }

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);

    this.history = data.history;
  }
}

module.exports = Searching;
