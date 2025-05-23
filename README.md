# netology-projectLibExpress
Library - education project (Netology)

Mongo DB

запрос(ы) для вставки данных минимум о двух книгах в коллекцию books:
db.books.insertMany(
    {
        title: "StarShip Troopers",
        description: "Space fantastic",
        authors: "Robert Heinlein"
    },
    {
        title: "Horus heresy",
        description: "WarHammer 40K universe",
        authors: "Dan Abnett"
    }
)

запрос для поиска полей документов коллекции books по полю title:
db.books.find(
    {
        title: "Horus heresy"
    }
)

запрос для редактирования полей: description и authors коллекции books по _id записи:
db.books.updateOne (
    _id: books.id
    {
        $set: {description: "Evgeniy Onegin",
               authors: "A. Pushkin"}
    }
)
