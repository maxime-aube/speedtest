import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// génère la liste des fichiers d'entrée à compiler
let entryPoints = {};
fs.readdirSync('./src').filter(file => !file.startsWith('_') && file.endsWith('.js')).forEach(fileName => {
    entryPoints[fileName.split('.')[0]] = `./src/${fileName}`;
});

const config = {
    mode: 'development',
    entry: entryPoints,
    devtool: 'inline-source-map',
    // devServer: {
    //     static: './Web/assets/action'
    // },
    plugins: [],
    output: {
        filename: '[name].js',
        path: path.join(path.dirname(fileURLToPath(import.meta.url)), './dist/js'),
        clean: false
    },
    module: {
        rules: [
            {
                // HTML
                test: /\.html$/i,
                loader: 'html-loader'
            },
            {   // css
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {   // images
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
            {   // fonts
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
}

export default config;