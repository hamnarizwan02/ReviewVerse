var Express = require("express");
var Mongoclient=require("mongodb").MongoClient;
var cors=require("cors");
const multer=require("multer");

var app=Express();
app.use(cors());

var CONNECTION_STRING = "mongodb+srv://Hamna:Poiuy12345@cluster0.c1raoub.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

var DATABASENAME = "ProductReview";
var database;

app.listen(5038, () => {
    Mongoclient.connect(CONNECTION_STRING, (error, client)=> {
        database=client.db(DATABASENAME);
        console.log("MongoDB Connection Successful");
    });
})

app.get('/api/ProductReview/Category', (request, response)=> {
    database.collection("Category").find({}).toArray((error,result) => {
        response.send(result);
    })
}) 

app.get('/api/ProductReview/Products', async (req, res) => {
    try {
      const products = await database.collection("Products").find({}).toArray();
      //console.log('Retrieved products:', products);
      res.send(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send({ message: 'Error fetching products' });
    }
}); 

app.get('/api/ProductReview/Reviews', async (req, res) => {
    try {
      const reviews = await database.collection("Reviews").find({}).toArray();
      //console.log('Retrieved reviews:', reviews);
      res.send(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).send({ message: 'Error fetching reviews' });
    }
}); 

app.get('/api/ProductReview/User', async (req, res) => {
  try {
    const reviews = await database.collection("User").find({}).toArray();
    console.log('Retrieved user:', reviews);
    res.send(reviews);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send({ message: 'Error fetching user' });
  }
}); 

app.use(Express.json()); // Middleware to parse JSON data
app.use(multer().none()); // Middleware to parse multipart/form-data without files

// app.post('/api/ProductReview/Reviews', async (request, response) => {
//     try {
//         const { name, email, productName, rating, review } = request.body;

//         // Retrieve userID from email
//         const user = await database.collection("User").findOne({ email });
//         if (!user) {
//             throw new Error('User not found');
//         }

//         // Retrieve productID from product name
//         const product = await database.collection("Products").findOne({ productname: productName });
//         if (!product) {
//             throw new Error('Product not found');
//         }

//         // Insert review into Reviews collection
//         const newReview = {
//             userID: [user._id], // Store userID as an array
//             productID: [product._id], // Store productID as an array
//             rating: parseInt(rating),
//             review,
//             timestamp: new Date(),
//             productname: productName
//         };
//         await database.collection("Reviews").insertOne(newReview);

//         response.status(201).json({ message: 'Review added successfully' });
//     } catch (error) {
//         console.error('Error adding review:', error);
//         response.status(500).json({ message: 'Error adding review' });
//     }
// });


app.post('/api/ProductReview/Reviews', async (request, response) => {
  try {
      const { name, email, productID, rating, review } = request.body;

      // Retrieve userID from email
      const user = await database.collection("User").findOne({ email });
      if (!user) {
          throw new Error('User not found');
      }

      // Retrieve product using product ID
      console.log('product id ' + productID);
      console.log('name ' + name);
      console.log('email ' + email);

      const product = await database.collection("Products").find({ _id: productID });
      if (!product) {
          throw new Error('Product not found');
      }

      // Insert review into Reviews collection
      const newReview = {
          userID: [user._id], // Store userID as an array
          productID: [product._id], // Store productID as an array
          rating: parseInt(rating),
          review,
          timestamp: new Date(),
          productname: product.productname
      };
      await database.collection("Reviews").insertOne(newReview);

      response.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
      console.error('Error adding review:', error);
      response.status(500).json({ message: 'Error adding review' });
  }
});
