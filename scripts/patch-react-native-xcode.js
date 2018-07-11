const JsDiff = require("diff");
const fs = require("fs");
const path = require("path");

const scriptFilePath = path.join(
    __dirname,
    "..",
    "node_modules",
    "react-native",
    "scripts",
    "react-native-xcode.sh"
);
const patchFilePath = path.join(
    __dirname,
    "react-native-xcode.sh.v2.patch"
);

let source = fs.readFileSync(scriptFilePath).toString();
let patch = fs.readFileSync(patchFilePath).toString();
let patched = JsDiff.applyPatch(source, patch);

if (patched) {
    patched = patched.replace("%%PACKAGER_IP%%", process.env.PACKAGER_IP);
    fs.writeFileSync(scriptFilePath, patched);
    process.on("exit", () => process.exit(0));
} else {
    console.warn("failed to apply patch to react-native-xcode.sh");
    process.on("exit", () => process.exit(0));
}
