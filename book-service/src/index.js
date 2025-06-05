const express = require('express');
const path = require('path');
const errorMiddleware = require('./middleware/404-errorMiddleware');
const indexRouter = require('./router');
const booksRouter = require('./router/books');
const mongoose = require('mongoose');
const { Server } = require("socket.io");
const http = require('http');

mongoose.connect('mongodb://localhost:27017/', {
    auth: {
        username: 'admin',
        password: 'example'
    }
}).then(() => console.log('Mongoose Connected!'));

const app = express();
const server = http.createServer(app);

const io = new Server(server);

module.exports.io = io;

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.set('view options', {
    async: false,
    compileDebug: true
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/', indexRouter)
app.use('/books', booksRouter)

io.on('connection', (socket) => {
    // console.log('Новое подключение:', socket.id);
});

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})