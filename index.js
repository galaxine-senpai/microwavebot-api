const express = require('express');
const app = express();
const ErrorHandler = require('./middleware/ErrorHandler.js');

// - - - Routers - - -

app.use('/v1', require('./versions/v1.js'));

// - - - End Routers - - -

app.get('/', (req, res) => {
    const APIVerAvail = {
        "APIVersionsAvailable": [
            "v1"
        ]
    }

    res.json(APIVerAvail);
});

// On 404 use the error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    next(err);
});
// 403 error
app.use((req, res, next) => {
    const err = new Error('Forbidden');
    next(err);
});
// 500 error
app.use((req, res, next) => {
    const err = new Error('Internal Server Error');
    next(err);
})

// - - - Middleware - - -

app.use(ErrorHandler);

// - - - End Middleware - - -


app.listen(81, () => console.log('Server running on port 81'));