const xcode = require("xcode");
const fs = require("fs");
const path = require("path");

const PROJECT_NAME = "tsukurioki";

const PROJECT_PATH = path.join(__dirname, "..", "ios", `${PROJECT_NAME}.xcodeproj`, "project.pbxproj");

let proj = xcode.project(PROJECT_PATH);
proj.parseSync();

let rootGroup = proj.findPBXGroupKey({name: PROJECT_NAME});
let mainTarget = proj.findTargetKey(PROJECT_NAME);

for(let i = 2; i < process.argv.length; ++i) {
    let file = process.argv[i];
    proj.addResourceFile(file, {target: mainTarget}, rootGroup);
}

fs.writeFileSync(PROJECT_PATH, proj.writeSync());