let {updater} = require('@architect/utils')
let path = require('path')
let fs = require('fs')
let update = updater('Deploy')

let messages = {
  missing_aws_cli: 'missing aws from PATH, please install the aws-cli',
  missing_creds: 'missing or invalid AWS credentials or credentials file',
  missing_region: '@aws region / AWS_REGION must be configured',
}

module.exports = function validate(/*opts*/) {
  try {
    if (process.env.ARC_AWS_CREDS === 'missing')
      throw Error('missing_creds')

    if (!binExists('aws'))
      throw ReferenceError('missing_aws_cli')

    if (!process.env.AWS_REGION)
      throw Error('missing_region')
  }
  catch(e) {
    update.error(`Failed to deploy, ${messages[e.message]}`)
    process.exit(1)
  }
}

function binExists(bin) {
  function getPaths(bin) {
    var envPath = (process.env.PATH || '')
    var envExt = (process.env.PATHEXT || '')
    return envPath.replace(/["]+/g, '').split(path.delimiter).map(function (chunk) {
      return envExt.split(path.delimiter).map(function (ext) {
        return path.join(chunk, bin + ext)
      })
    }).reduce(function (a, b) {
      return a.concat(b)
    })
  }
  return getPaths(bin).some(fs.existsSync)
}
