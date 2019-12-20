let express = require('express');
let app = express();
let fs = require('fs');
let bodyParser = require('body-parser');

let urlencodedParser = bodyParser.urlencoded({extended: false});
const PORT = process.env.PORT || 3000;

let json = fs.readFileSync('poetry.json', 'utf8');
let poetry = JSON.parse(json);

let jsonOne=fs.readFileSync('poems.json', 'utf8');
let poems = JSON.parse(jsonOne);
//console.log(poetry["poetry"]);
//console.log(poems);

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/poetry', function (req, res) {
    res.render('poetry', {values: poetry["poetry"]});
});

app.get('/poetry/:id', function (req, res) {

    var data = req.app.get('data');
    id = req.params.id;
    id=id.split(":id")[1];

    let arr= poems["poems"];
    for(let key in arr){
        if(arr[key]["name"]===id){
            res.render('poem', {name: id, poem: arr[key]["text"]});
        }
    }
});


app.post('/add', urlencodedParser, function (req, res) {
    let arrPoem = [];
    let Poem = [];
    arrPoem.push(req.body.title);
    Poem.push(req.body.text);
    let newPoetry =
        {
            "author" : req.body.author,
            "poems" : arrPoem
    };
    let newPoem =
    {
        "name": req.body.title,
        "text": Poem
    }
    addPoem(newPoem);
    addPoetry(newPoetry);
    res.render('add');
});

app.get('/add', urlencodedParser, function (req, res) {
    res.render('add');
});


app.listen(PORT, function () {
    console.log('Example app listening on port 3000!');
});


function addPoetry(poet) {
    poetry.poetry.push(poet);
    fs.writeFileSync('poetry.json', JSON.stringify(poetry));
}

function addPoem(poem) {
    poems.poems.push(poem);
    fs.writeFileSync('poems.json', JSON.stringify(poems));
}