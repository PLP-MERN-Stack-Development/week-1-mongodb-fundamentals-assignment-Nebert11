// ### Task 2: Basic CRUD Operations
// Write MongoDB queries to:
db.books.find({genre: "Fantasy"}) //   - Finds all books in a specific genre
db.books.find({published_year: {$gt: 1930 } }) //   - Finds books published after a certain year
db.books.find({author: "J.R.R Tolkien"}) //   - Finds books by a specific author
db.books.updateOne({title: "The Hobbit"}, //   - Updates the price of a specific book
    {$set: {price: 15.55}}
)
db.books.deleteOne({title: "Brave New World"}) //   - Deletes a book by its title

// ### Task 3: Advanced Queries
db.books.find(
    {in_stock: true, published_year: {$gt: 2010}}, // - Write a query to find books that are both in stock and published after 2010
    {title: 1, author: 1, price: 1} // - Use projection to return only the title, author, and price fields in your queries
)

// - Implement sorting to display books by price (both ascending and descending)
db.books.find(
  {in_stock: true, published_year: {$gt: 1930} },
  {title: 1, author:1, price: 1},
).sort({price:1 })

// - Use the `limit` and `skip` methods to implement pagination (5 books per page)
db.books.find(
  {in_stock: true, published_year: {$gt: 1930} },
  {title: 1, author:1, price: 1},
).sort({price:1 }).skip(0).limit(5)

// ### Task 4: Aggregation Pipeline
// - Create an aggregation pipeline to calculate the average price of books by genre
db.books.aggregate([
    {
        $group: {
            _id: "$genre",
            average_price: {$avg: "$price"}
        }
    }
])

// - Create an aggregation pipeline to find the author with the most books in the collection
db.books.aggregate([
  {
		$group:{
			_id: "$author",
			total_books:{$sum: 1 }
		}
	},
  {$sort: {total_books: -1} },
  {$limit: 1}
])

// - Implement a pipeline that groups books by publication decade and counts them
db.books.aggregate([

    {
        $project: {
            decade: {
                $concat: [
                    { $toString: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] } },
                    "s"
                ]
            }
        }
    },
    {
		$group: {
			_id: "$decade",
			count:{$sum: 1}
		}
	},
    {$sort: {_id: 1} }
])

// ### Task 5: Indexing
// - Create an index on the `title` field for faster searches
db.books.createIndex({ title: 1})

// - Create a compound index on `author` and `published_year`
db.books.createIndex({ author: 1, published_year: -1})

// - Use the `explain()` method to demonstrate the performance improvement with your indexes
db.books.find({ title: "1984"}).explain ("executionStats")