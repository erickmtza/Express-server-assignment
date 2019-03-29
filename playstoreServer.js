const express = require('express');
const morgan = require('morgan');

const playstore = require('./playstore');

const app = express();

app.use(morgan('common'));

app.get('/apps', (req, res) => {
    const genresAvailable = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];

    const { sort = '', genre = '' } = req.query;
    

    if(sort) {
        if(!['Rating', 'App'].includes(sort)) {
          return res
            .status(400)
            .send('Sort must be one of Rating or App');
        }
    }

    if(genre) {
        if(!genresAvailable.includes(genre)) {
          return res
            .status(400)
            .send('Genres must be one of Action, Puzzle, Strategy, Casual, Arcade, Card');
        }
    }

    let results = playstore
        .filter(app => 
            app
                .Genres
                .includes(genre)
        );

    if(sort) {
            results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
            }); 
        }

    res
        .json(results);

})

app.listen(8000, () => {
    console.log('Server started on PORT 8000');
});