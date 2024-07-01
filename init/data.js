const mysql = require("mysql2");
const express = require("express");
const app = express();

const connection = mysql.createConnection( {
    host : 'localhost',
    user : 'root',
    database : 'wanderlust',
    password : 'PRUven2911??'
});

let q = 'INSERT INTO listing(id,title,description,image,price,location,country) VALUES (1,"Rushikonda","Beach in AP","https://unsplash.com/photos/a-pier-with-a-ferris-wheel-in-the-background-BVNk9JeytKA",1200,"Andhra","India"),(2,"Times Square","Tourist Attraction in NY","https://unsplash.com/photos/ln5drpv_ImI",2000,"New York","USA"),(3,"Eiffel Tower","Monument in Paris","https://unsplash.com/photos/JmuyB_LibRo",3000,"Île-de-France","France"),(4,"Sydney Opera House","Opera House in Sydney","https://unsplash.com/photos/JmuyB_LibRo",2500,"New South Wales","Australia"),(5,"Mount Fuji","Mountain in Japan","https://unsplash.com/photos/MXbM1NrRqtI",3776,"Chubu","Japan"),(6,"Christ the Redeemer","Statue in Rio de Janeiro","https://unsplash.com/photos/1AK88wJ_hlY",710,"Rio de Janeiro","Brazil"),(7,"Great Wall of China","Historic Wall in China","https://unsplash.com/photos/Ra8f_QW6ifk",21196,"Beijing","China"),(8,"Pyramids of Giza","Pyramids in Egypt","https://unsplash.com/photos/ZRFzHW0E8y8",138.8,"Giza","Egypt"),(9,"Machu Picchu","Historic Site in Peru","https://unsplash.com/photos/z9IuTW65scw",2430,"Cusco","Peru"),(10,"Santorini","Island in Greece","https://unsplash.com/photos/46Ec6x0KyOs",300,"Cyclades","Greece"),(11,"Statue of Liberty","Monument in NY","https://unsplash.com/photos/1RWFPyI-FNw",93,"New York","USA"),(12,"Colosseum","Amphitheatre in Rome","https://unsplash.com/photos/e8wj59e7IAI",48,"Lazio","Italy"),(13,"Taj Mahal","Mausoleum in India","https://unsplash.com/photos/WLxQvbMyfas",73,"Uttar Pradesh","India"),(14,"Niagara Falls","Waterfall in NY","https://unsplash.com/photos/Uow-XW7hczE",51,"New York","USA/Canada"),(15,"Golden Gate Bridge","Bridge in SF","https://unsplash.com/photos/e6FMMambeO4",2737,"California","USA")';


function initdata() {
    connection.query(q, (err,result) => {
        console.log("INITIAL DATA STORED");
   });
   connection.end();
}

initdata();