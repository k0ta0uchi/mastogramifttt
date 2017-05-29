var express     = require('express'),
    https       = require('https'),
    bodyParser  = require('body-parser'),
    fs          = require('fs'),
    Masto       = require('mastodon'),
    auth        = require('./auth');

// pref.json file will created first time.
var pref;
try {
    pref = JSON.parse(fs.readFileSync('pref.json', 'utf-8'));
}
catch(e) {
    // auth process.
    auth();
    return;
}

// instance settings.
let M = new Masto({
    access_token: pref.access_token,
    timeout_ms: 60 * 1000,
    api_url: pref.baseUrl + '/api/v1/',
});

// express server settings.
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

console.log('starting server at "127.0.0.1:1337".');
app.listen(1337);

// just for test
app.get('/', (req, res) => {
    res.send('test ok');
});

// post url
app.post('/', (req, res) => {
    var url = req.body.imageUrl;
    var status = req.body.status;

    console.log("image url: " + url);
    console.log('status: ' + status);

    // download image first.
    var tempPath = './temp.jpg';
    var image = fs.createWriteStream(tempPath);
    var request = https.get(url, (_res) => {
        _res.pipe(image);
    });

    // on finish downloading image
    image.on('finish', () => {
        // post media to mastodon
        M.post('media', { file: fs.createReadStream(tempPath) }).then(resp => {
            const id = resp.data.id;

            // post status using media id.
            M.post('statuses', { status: status, media_ids: [id] }).then(resp => {
                console.log('status posted successfully.');
                fs.unlinkSync(tempPath);
                res.sendStatus(200);
            });
        });
    });
});
