var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')(),
	browserSync = require('browser-sync').create();

/////////
// CSS //
/////////
gulp.task('css', function(){
	return gulp.src('./sass/**/*.scss')
	.pipe(plugins.plumber())
    .pipe(plugins.sass({
    	outputStyle:'compressed',
    	includePaths: [
    		'./node_modules/materialize-css/sass/'
    	]
    }).on('error', plugins.sass.logError))
    .pipe(gulp.dest('../dist/'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

////////
// JS //
////////
gulp.task('js', function(){
	return gulp.src([
			'./js/*.js'
		])
		.pipe(plugins.plumber())
		// .pipe(plugins.uglify())
		.pipe(gulp.dest('../dist/'));
});

gulp.task('background.js', function(){

});

gulp.task('content_script.js', function(){

})

//////////
// HTML //
//////////
gulp.task('html', function(){
	return gulp.src('./pug/**/*.pug')
	.pipe(plugins.plumber())
    .pipe(plugins.pug())
    .pipe(gulp.dest('../dist/'));
});

///////////
// Watch //
///////////
gulp.task('watch', function(){
	// Styles
	gulp.watch('./sass/**/*.scss', ['css']);

	// Scripts
	gulp.watch(['./js/**/*.js'], ['js']);

	// html
	gulp.watch(['./pug/**/*.pug'], ['html']);
});

///////////////////
// Static server //
///////////////////
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "../dist/"
        }
    });
});

/////////////
// Default //
/////////////
gulp.task('default', ['css', 'js', 'html', 'browser-sync', 'watch']);