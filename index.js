import express from "express";
import * as cheerio from "cheerio";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const Port = process.env.PORT || 5000;
//const Link = process.env.URL;


app.get("/", (req, res) => {
  try {
    res.status(200).json("Nairobi Securities Exchange Live Data");
  } catch (error) {
    console.error({ message: error.message });
  }
});

app.get("/nse", async (req, res) => {
  try {
    const data = [];
    const response = await fetch('https://afx.kwayisi.org/nse/');
    const body = await response.text();
    const $ = cheerio.load(body);

    //const wrapper = $('body > div > div > div > main > article > div.t > table > tbody');
    $(
      "body > div > div > div > main > article > div.t > table > tbody > tr"
    ).each((i, el) => {
      const ticker = $(el).find("td:nth-child(1) > a").text();
      const name = $(el).find("td:nth-child(2) > a").text();
      const volume = $(el).find("td:nth-child(3)").text();
      const price = $(el).find("td:nth-child(4)").text();
      const change = $(el).find("td:nth-child(5)").text();

      data.push({ ticker, name, volume, price, change });
      //console.log(data);
    });

    res.status(200).json(data);
    //console.log(wrapper)
    console.log("Data scrapped successfully");
  } catch (error) {
    console.error({ message: error.message });
    res.status(400).json({message: error.message});
  }
});

app.listen(Port, () => {
  console.log(`Server running on Port ${Port}`);
});
