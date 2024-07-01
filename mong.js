const express = require("express");
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/user')
    .then(() => console.log('Connected!'))
    .catch((error) => console.error('Error connecting:', error));