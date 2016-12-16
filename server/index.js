import 'babel-polyfill';
import express from 'express';
import cheeseList from './cheese-list';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Cheese from './models/cheese';


mongoose.Promise = global.Promise;
const DATABASE_URL = 'mongodb://localhost/cheese';

const HOST = process.env.HOST;
const PORT = process.env.PORT || 8080;

console.log(`Server running in ${process.env.NODE_ENV} mode`);

const app = express();

app.use(express.static(process.env.CLIENT_PATH));

app.use(bodyParser.json());

app.post('/cheeses/:cheese_name', function(req, res) {
    Cheese.create({name: req.params.cheese_name})
    .then(cheese => res.status(201).json(cheese._id))
    .catch(error => res.sendStatus(422));
})

app.get('/cheeses', function(req, res) {
  console.log('request received...');
  Cheese.find().then(cheeseList => res.status(200).json(cheeseList))
  .catch(error=> res.sendStatus(422));
});

var runServer = function(callback) {
    mongoose.connect(DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(PORT, function() {
            console.log('Listening on localhost:' + PORT);
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};
