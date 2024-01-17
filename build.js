import esbuild from "esbuild";
import fs from "fs";
import path from "path";

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
})
    .then(() => {
        copyDirRecursive("static", distPath)
    })
    .catch(err => {
        console.error(err)
        process.exit(1)
    })

function copyDirRecursive(dir, dest) {
    fs.readdirSync(dir).forEach(file => {
        const p = path.join(dir, file)
        if (fs.lstatSync(p).isDirectory()) {
            fs.mkdirSync(path.join(dest, file))
            copyDirRecursive(p, path.join(dest, file))
        } else {
            fs.copyFileSync(p, path.join(dest, file))
        }
    })
}
