module.exports = {
    publicPath: '/phaedra/ui/',
    chainWebpack: (config) => {
        config.module
            .rule("mjs")
                .test(/\.mjs$/)
                .type("javascript/auto")
                .include.add(/node_modules/)
                .end()
            .rule("config.js")
                .test(/config\.js$/)
                .use("file-loader")
                .loader("file-loader")
                .options({ name: "config.js" })
                .end()
        ;
    }
}
