const path = require('path');
const axios = require('axios');
const booksModel = require('../models/books.model');
const {io} = require("../index");

const createUser = async (req, res) => {
    res.status(201).json({id: 1, mail: "test@mail.ru"})
}

const getCreateBooks = async (req, res) => {
    res.render("library/create", {
        title: "Добавить книгу  ",
    });
}

const createBooks = async (req, res) => {
    const {title, description, authors, favourite, fileCover, fileName} = req.body

    try {
        if (!req.file) {
            return res.status(400).json({error: 'Файл книги обязателен'});
        }

        const newBook = new booksModel(
            {
                title,
                description,
                authors,
                favourite,
                fileCover,
                fileName,
                fileBook: req.file.filename
            }
        )
        await newBook.save();
        res.status(201)
        res.redirect(`/books/getAllBooks`);
    } catch (error) {
        console.error(error)
    }
}

const getAllBooks = async (req, res) => {
    try {
        const books = await booksModel.find()
        res.render("./library/index", {
            title: 'Библиотека',
            currentPath: req.path,
            books: books
        });
    } catch (error) {
        console.error(error)
    }
}

const getBooksByID = async (req, res) => {
    const {id} = req.params
    try {
        const book = await booksModel.findById({_id: id})
        if (book) {
            axios.post(`http://localhost:3005/counter/${id}/incr`).catch(err => {
                console.error("Ошибка при инкременте счетчика:", err.message);
            })
            axios.get(`http://localhost:3005/counter/${id}/`)
                .then(viewsResponse => {
                    let viewsCount = viewsResponse.data.count;
                    res.render("library/view", {
                        title: "Просмотр",
                        book: {
                            ...book.toObject(),
                            views: viewsCount
                        },
                    });
                })
                .catch(err => {
                console.error("Ошибка при ответе:", err.message);
            })
        } else {
            res.status(404)
            res.json('404 | Страница не найдена')
        }
    } catch (error) {
        console.error(error)
    }
}

const getUpdateBooks = async (req, res) => {
    const {id} = req.params
    try {
        const book = await booksModel.findById({_id: id})
        res.render("library/update", {
            title: "Редактировать книгу",
            book: book
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Ошибка сервера");
    }
}

const updateBooks = async (req, res) => {
    const {title, description, authors} = req.body
    const {id} = req.params
    try {
        const book = await booksModel.updateOne (
            {_id: id},
        {
            $set: {
                title: title,
                description: description,
                authors: authors
            }
        })
        if (!book) {
            res.status(404)
            res.json('404 | Страница не найдена')
        }
        res.redirect(`/books/getAllBooks/`)
    } catch (error) {
        console.error(error)
    }

}

const deleteBooks = async (req, res) => {
    const {id} = req.params
    try {
        await booksModel.deleteOne ({_id: id})
        res.redirect(`/books/getAllBooks/`)
    } catch (error) {
        console.error(error)
    }
}

const downloadBooks = async (req, res) => {
    try {
        const {books} = library

        const book = books.find(b => b.id === req.params.id);
        const filePath = path.join(__dirname, '../public/books', book.fileBook);

        res.download(filePath, book.fileName, (err) => {
            if (err) {
                console.error('Ошибка скачивания:', err);
                res.status(500).json({ error: 'Ошибка при скачивании файла' });
            }
        });
    } catch (error) {
        console.error(error)
    }
}

const addComment = async (req, res) => {
    const {id} = req.params;
    const {comment} = req.body;
    const io = req.io
    try {
        const book = await booksModel.findById(id);
        if (!book) {
            return res.status(404).json({error: 'Книга не найдена'});
        }

        book.comments.push(comment);
        await book.save();

        io.emit('newComment', {bookId: id, comment});

        res.redirect(`/books/getBooksByID/${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
}

module.exports = {
    getUpdateBooks,
    getCreateBooks,
    createUser,
    createBooks,
    getAllBooks,
    getBooksByID,
    updateBooks,
    deleteBooks,
    downloadBooks,
    addComment
}
