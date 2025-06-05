const express = require('express')
const router = express.Router()
const bookService = require('../service')
const uploadBooksMiddleware  = require('../middleware/uploadBooksMiddleware')

router.post('/user/login', bookService.createUser)

router.get('/getCreate', bookService.getCreateBooks)
router.post('/create', uploadBooksMiddleware, bookService.createBooks)

router.get('/getAllBooks', bookService.getAllBooks)
router.get('/getBooksByID/:id/', bookService.getBooksByID)

router.get('/getUpdate/:id', bookService.getUpdateBooks)
router.post('/update/:id/', bookService.updateBooks)

router.post('/delete/:id/', bookService.deleteBooks)

router.get('/download/:id/', bookService.downloadBooks)

router.post('/addComment/:id', bookService.addComment)


module.exports = router;