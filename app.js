const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const exphbs = require('express-handlebars')
const passport = require('passport')
const mongoose = require('mongoose');
const session = require('express-session')
const morgan = require('morgan')
const cors = require('cors');
const MongoStore = require('connect-mongo')(session)
const {ensureAuth, ensureGuest } = require('./middleware/auth')

const app = express();

// allow cross-origin requests
app.use(cors());
app.use(morgan('dev'))

require('./config/passport')(passport)


const GOOGLE_CLIENT_ID = '620049675920-52hh0ole1hlicl32ccblea5agfijbo3d.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = 'UF8QpBcZvafdJfqODQxO-DFt'


// connect to mlab database
// make sure to replace my db string & creds with your own
//mongodb://ninja:test@ds161148.mlab.com:61148/graphql-ninja
//mongoose.connect('mongodb+srv://cluster0.aeeej.mongodb.net/graphqldb --username hymanshu --password zqW6z1zIudKosdp3',{useNewUrlParser : true})
mongoose.connect('mongodb+srv://hymanshu:zqW6z1zIudKosdp3@cluster0.aeeej.mongodb.net/graphqldb?retryWrites=true&w=majority',{useNewUrlParser : true, useUnifiedTopology : true})
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});


app.engine('.hbs',exphbs({defaultLayout:'main', extname:'.hbs'}))
app.set('view engine', '.hbs')


app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:false,
    store: new MongoStore({
        mongooseConnection:mongoose.connection
    })
}))


app.use(passport.initialize())
app.use(passport.session())

// bind express with graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.get('/',(req,res)=>{
    res.send('Home: goto /auth/google for authentication')
})

app.get('/home',ensureAuth,(req,res)=>{
    res.send('Congrats! You are logged in using google')
})

app.use('/auth',require('./routes/auth'))

app.listen(3000, () => {
    console.log('now listening for requests on port 4000');
});
