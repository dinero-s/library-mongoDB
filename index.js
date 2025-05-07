const express = require('express');
const router = require('./router');
const path = require('path');
const errorMiddleware = require('./middleware/404-errorMiddleware');
const indexRouter = require('./router/index');
const booksRouter = require('./router/books');

const app = express();
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.set('view options', {
    async: false, // или true, если используете асинхронные шаблоны
    compileDebug: true
});
// app.use('/', indexRouter)
app.use('/books', booksRouter)

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})