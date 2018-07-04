const xcode = require("xcode");
const fs = require("fs");
const path = require("path");

const PROJECT_NAME = "tsukurioki";
const PROJECT_PATH = path.join(__dirname, "..", "ios", "tsukurioki.xcodeproj", "project.pbxproj");

let proj = xcode.project(PROJECT_PATH);
proj.parseSync();

let rootGroup = proj.findPBXGroupKey({name: PROJECT_NAME});
let file = proj.addFile("GoogleService-Info.plist",rootGroup, {});
file.uuid = proj.generateUuid();
proj.addToPbxBuildFileSection(file);

fs.writeFileSync(PROJECT_PATH, proj.writeSync());
