const fs = require('fs');

function generateAndAddKey(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        key += characters[randomIndex];
    }

    const apikeyjson = JSON.parse(fs.readFileSync('./data/apikeys.json', 'utf8'));
    apikeyjson.keys.push(key);
    const updatedJson = JSON.stringify(apikeyjson, null, 4);
    fs.writeFileSync('./data/apikeys.json', updatedJson);

    return key;
}



module.exports = { generateAndAddKey }
