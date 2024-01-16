const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const distPath = "dist";

if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, {recursive: true})
}

esbuild.build({
    entryPoints: [
        "src/background.ts",
    ],
    outbase: "src",
    outdir: distPath,
    bundle: true,
    target: "es2020",
    watch: !!process.env.WATCH,
})
    .then(() => {
        copyDirRecursive("static", distPath)
    })
    .catch(() => process.exit(1))

function copyDirRecursive(dir, dest) {
    fs.readdirSync(dir).forEach(file => {
        const p = path.join(dir, file)
        if (fs.lstatSync(p).isDirectory()) {
            copyDirRecursive(p, path.join(dest, file))
        } else {
            fs.copyFileSync(p, path.join(dest, file));
        }
    })
}
