module.exports = {
    plugins: [
        require('autoprefixer'),
        require('css-mqpacker'),
        // require('cssnano') ({ // comment to stop minimization
        //     preset: [
        //         'default', {
        //             discardComments: {
        //                 removeAll: true
        //             }
        //         }
        //     ]
        // })
    ]
}