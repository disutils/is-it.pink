const bodyParser = require('body-parser');
const express = require('express');
const { name, pfp } = require('./configuration/config.json');

const app = express();



app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static("assets"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const port = 10;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Main routes
const mainRoutes = require('./routes/main');

// Main routes
app.use(mainRoutes);


app.get('/trigger-400', (req, res, next) => {
    const err = new Error('Bad Request');
    err.status = 400;
    next(err);
});

app.get('/trigger-401', (req, res, next) => {
    const err = new Error('Unauthorized');
    err.status = 401;
    next(err);
});

app.get('/trigger-403', (req, res, next) => {
    const err = new Error('Forbidden');
    err.status = 403;
    next(err);
});

app.get('/trigger-404', (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.get('/trigger-500', (req, res, next) => {
    const err = new Error('Internal Server Error');
    err.status = 500;
    next(err);
});

// Error handling middleware
app.use((err, req, res, next) => {
    const errorImages = {
        400: '/img/400-illustration.jpg',
        401: '/img/401-illustration.jpg',
        403: '/img/403-illustration.jpg',
        404: '/img/404-illustration.jpg',
        500: '/img/500-illustration.png'
    };
    const status = err.status || 500;
    console.error(`Error ${status}: ${err.message}`); // Print the error to the console
    res.status(status);
    res.render('main/error-handling', { name, pfp, status, imgPath: errorImages[status] });
});

// Handle 404 errors last
app.use((req, res, next) => {
    res.status(404).render('main/error-handling', { name, pfp, status: 404, imgPath: '/img/404-illustration.jpg' });
});