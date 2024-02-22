import axios from "axios";
import * as cheerio from "cheerio";
import * as xlsx from "xlsx";

// Array to store product data
const productData = [];

// Async function to fetch data from Flipkart
const fetchData = async () => {
  // Send GET request to Flipkart
  try {
    const response = await axios.get(
      "https://www.flipkart.com/search?q=apple+mobiles&sid=tyy%2C4io&as=on&as-show=on&otracker=AS_QueryStore_OrganicAutoSuggest_1_7_na_na_na&otracker1=AS_QueryStore_OrganicAutoSuggest_1_7_na_na_na&as-pos=1&as-type=RECENT&suggestionId=apple+mobiles%7CMobiles&requestId=74513d15-9fcc-41ea-a7e0-16499e689ee3&as-backfill=on&otracker=nmenu_sub_Electronics_0_Apple&page=2",
      {
        headers: {
          "content-type": "text/html",
        },
      }
    );

    // Load HTML response into Cheerio
    const $ = cheerio.load(response.data);

    // Select product cards using Cheerio
    const productsCards = $("._1AtVbE");

    // Iterate through each product card
    productsCards.each((i, card) => {
      // Extract relevant information from the card
      const title = $(card).find("div._4rR01T").text();
      const price = $(card).find("div._30jeq3._1_WHN1").text();
      const ratings = $(card).find("div._3LWZlK").text();
      const processor = $(card).find("li.rgWa7D:nth-child(4)").text();

      // Create a data object and add it to the array if title and price are present
      const dataobj = {
        title,
        price,
        ratings,
        processor,
      };
      if (!title || !price) {
        return; // Skip if title or price is missing
      }
      productData.push(dataobj);
    });
    console.log(productData);

    // Create a new Excel workbook
    const workbook = xlsx.utils.book_new();

    // Convert product data array to a worksheet
    const worksheet = xlsx.utils.json_to_sheet(productData);

    // Append the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, "output.xlsx");

    // Write the workbook to a file
    xlsx.writeFile(workbook, "output.xlsx");
  } catch (err) {
    console.log(err);
  }
};

// Call the fetchData function to initiate the process
fetchData();
