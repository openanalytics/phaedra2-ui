const {Loading} = require("quasar");
module.exports = function (ctx) {
    console.log(ctx)
    return {
        plugins: [
            'Notify',
            'Loading'
        ],
        css: [
            'quasar.variables.scss',
            'oa.global.scss'
        ]
    }
}
