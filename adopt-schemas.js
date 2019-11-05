/**
 * Copy schemas locally and make them referencable in Open API specification
 */

const fs = require('fs');
const path = require('path');

function copyFolderRecursiveSync(source, target, reader) {
    if (fs.lstatSync(source).isDirectory()) {
        if (!fs.existsSync(target)) {
            fs.mkdirSync(target);
        }

        const files = fs.readdirSync(source);
        files.forEach(function (file) {
            var curSource = path.join(source, file);
            var curTarget = path.join(target, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, curTarget, reader);
            } else {
                fs.writeFileSync(curTarget, reader ? reader(curSource, curTarget) : fs.readFileSync(curSource));
            }
        });
    }
}

const rootSource = "../maas-schemas/schemas"
const rootDest = "./schemas"

// FIXME use dependency ffs
copyFolderRecursiveSync(rootSource, rootDest, (f) => {
    if (f.endsWith(".json")) {
        // Produce relative to the root folder path for a schemas
        const paths = path.resolve(f).substring(path.resolve(rootSource).length + 1).split("/")
        const dots = paths.map(p => "..").join("/")
        let str = fs.readFileSync(f, { encoding: "utf-8" })
        // Fix schema $id
        str = str.replace('"$id": "http://maasglobal.com/core/booking.json#",', '"$id": "http://maasglobal.com/core/booking.json",')
        // Serve locally
        str = str.replace(/\"\$ref\": \"http:\/\/maasglobal.com/g, '"$ref": "' + dots + '/schemas')
        return str;
    } else {
        return fs.readFileSync(f)
    }
})

