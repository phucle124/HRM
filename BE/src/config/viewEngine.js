const path = require('path')


const configEngine = (app)=>{
    app.set('views', path.join('./src','views'));
    app.set('view engine','ejs');
}

module.exports = configEngine;