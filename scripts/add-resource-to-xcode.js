const xcode = require("xcode");
const fs = require("fs");
const path = require("path");

const PROJECT_NAME = "tsukurioki";
const PROJECT_ROOT = path.join(__dirname, "..", "ios");
const PROJECT_FILE_PATH = path.join(PROJECT_ROOT, `${PROJECT_NAME}.xcodeproj`, "project.pbxproj");

let proj = xcode.project(PROJECT_FILE_PATH);
proj.parseSync();

let rootGroup = proj.findPBXGroupKey({name: PROJECT_NAME});
let mainTarget = proj.findTargetKey(PROJECT_NAME);

for(let i = 2; i < process.argv.length; ++i) {
    let file = process.argv[i];
    if (!fs.statSync(path.join(PROJECT_ROOT, file)).isFile()) {
        throw new Error(file + " is not exists.");
    }
    proj.addResourceFile(file, {target: mainTarget}, rootGroup);
}

fs.writeFileSync(PROJECT_FILE_PATH, proj.writeSync());