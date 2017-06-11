 module.exports = function auth() {
    const rl = require('readline-sync'),
          Mastodon = require('./node_modules/mastodon-api/lib/mastodon.js'),
          fs       = require('fs');
    
    let clientId;
    let clientSecret;

    var baseUrl = rl.question('Please enter the web address of instance:');
    if(baseUrl.indexOf('https://') == -1) {
        baseUrl = 'https://' + baseUrl;
    }

    Mastodon.createOAuthApp(baseUrl + '/api/v1/apps', 'MastoGramIFTTT', 'read write follow')
    .catch(err => console.error(err))
    .then((res) => {
        console.log('Please save \'id\', \'client_id\' and \'client_secret\' in your program and use it from now on!');
        console.log(res);

        clientId = res.client_id;
        clientSecret = res.client_secret;

        return Mastodon.getAuthorizationUrl(clientId, clientSecret, baseUrl);
    })
    .then(url => {
        console.log('This is the authorization URL. Open it in your browser and authorize with your account!');
        console.log(url);
        return rl.question('Please enter the code from the website: ');
    })
    .then(code => Mastodon.getAccessToken(clientId, clientSecret, code, baseUrl))
    .catch(err => console.error(err))
    .then(accessToken => {
        console.log(`This is the access token. \n${accessToken}\nSaved as access_token.\nPlease exec "node index.js" again.`);
        fs.writeFileSync('pref.json', JSON.stringify(
        {
            baseUrl: baseUrl,
            access_token: accessToken
        }), 'utf-8');
    }); 
}