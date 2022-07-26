export const codebase = () => {
    return app.gulp.src(app.path.src.codebase)
        .pipe(app.gulp.dest(app.path.build.codebase))
}