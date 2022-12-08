export const jsWebix = () => {
    return app.gulp.src(app.path.src.jsW)
        .pipe(app.gulp.dest(app.path.build.js))
}