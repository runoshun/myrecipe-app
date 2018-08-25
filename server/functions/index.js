const isLambda = !!process.env["AWS_LAMBDA_FUNCTION_NAME"];

if (isLambda) {
    module.exports = require("./lib/awslambda");
} else {
    module.exports = require("./lib/fbfunctions");
}