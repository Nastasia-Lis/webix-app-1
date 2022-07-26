export const init = () => {
    return app.gulp.src(app.path.src.init)
        .pipe(app.gulp.dest(app.path.build.init))
}