module.exports = function (ctx) {
    console.log(ctx)
    return {
        css: [
            'quasar.variables.scss',
            'oa.global.scss'
        ]
    }
}
