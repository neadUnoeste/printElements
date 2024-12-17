const gulp = require("gulp");
const { parallel } = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify-es").default;
const rename = require("gulp-rename");

// Tarefa para processar o arquivo printElements.js
gulp.task("build-js", () => {
  return gulp
    .src("printElements.js") // Arquivo de entrada
    .pipe(
      babel({
        presets: ["@babel/preset-env"], // Transpila para ES5/ES6+
        plugins: ["@babel/plugin-transform-runtime"], // Adiciona o suporte ao runtime
      })
    )
    .pipe(uglify()) // Minifica o código
    .pipe(rename("printElements.min.js")) // Renomeia o arquivo
    .pipe(gulp.dest("dist/")); // Salva o arquivo na pasta dist
});

// // Observa mudanças no arquivo printElements.js
gulp.task("watch", () => {
  gulp.watch("printElements.js", gulp.series("build-js"));
});

// // Tarefa padrão do Gulp
gulp.task("default", gulp.series("build-js", "watch"));

gulp.task("minifyJS", () => {
    return gulp
      .src("*.js")
      .pipe(babel({
        presets: ["@babel/preset-env"], // Transpila para ES5/ES6+
      }))
      .pipe(uglify())
      .pipe(rename("printElements.min.js"))
      .pipe(gulp.dest("dist/"));
});

gulp.task("build", parallel("minifyJS"));