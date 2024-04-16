module.exports = function (ctx) {
    console.log(ctx)
    return {
        plugins: [
          'Notify'
        ],
        css: [
            'quasar.variables.scss',
            'oa.global.scss'
        ]
    }
}
