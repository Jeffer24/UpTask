const path = require('path');
const webpack =require ('webpack');

module.exports={
    entry: './public/js/app.js',
    output :{
        filename : 'bundle.js',
        path: path.join(__dirname, './public/dist')
    },
    module:{
        rules:[
            {
                //js
                test: /\.m?j$/,
                use:{
                    loader:'babel-loader',
                    options: {
                        presets:['@babel/preset-env']
                    }
                }
            }
        ]
    }
}