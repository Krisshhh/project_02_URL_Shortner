const express = require('express');
const path = require('path');
const cookieParser=require('cookie-parser');
const { connectToMongoDB } = require('./connect');
const { restrictToLoggedinUserOnly, checkAuth} = require('./middlewares/auth');

const URL = require('./models/url');

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/StaticRouter');
const userRoute = require('./routes/user');

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/url-shortner').then(() => console.log("MongoDB connected"));

app.set('view engine', 'ejs'); // added
app.set('views', path.resolve('./views')); // added

app.use(express.json()); //Middleware
app.use(express.urlencoded({ extended: false })); //Middleware to support form data
app.use(cookieParser()); //Middleware to support cookies



// app.get('/test', async (req, res) => {
//    const allURLs = await URL.find({});
//    // we can use html using below method but it wont be a good practice, so use EJS or any other templating engine like handlebars or pug...

//    // return res.end(`
//    //    <html>
//    //       <head> </head>
//    //       <body>
//    //          <h1> All URLs </h1>
//    //          <ol>
//    //             ${allURLs.map(url => `<li> ${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length} </li>`).join('')}
//    //          </ol>
//    //    </html>
//    //    `)
//    return res.render('home', {
//       urls: allURLs,
//    });
// });

app.use("/url",restrictToLoggedinUserOnly, urlRoute); //this middleware will run only when we hv logged in user
app.use("/user", userRoute);
app.use('/',checkAuth, staticRoute);

// app.get('/url/:shortId', async (req, res) => { // url changed
//    const shortId = req.params.shortId;
//    const entry= await URL.findOneAndUpdate({
//       shortId
//    }, {
//       $push: {
//          visitHistory: {
//             timestamp: Date.now(),
//          },
//       },
//    });
//    res.redirect(entry.redirectURL);
// });
app.get('/url/:shortId', async (req, res) => {
   const shortId = req.params.shortId;
   const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true } // Ensure updated document is returned
   );

   if (!entry) {
      return res.status(404).send("Short URL not found");
   }

   res.redirect(entry.redirectURL);
});

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));