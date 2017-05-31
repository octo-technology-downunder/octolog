
function prepareHttpRequest(httpCode, json, cb) {
  cb(null, {
    statusCode: httpCode,
    body: JSON.stringify(json),
  });
}

function prepareErrorHttpRequest(httpCode, msg, cb) {
  prepareHttpRequest(httpCode, {
    error: true,
    code: httpCode,
    message: msg
  }, cb)
}

function notFound(msg, cb) {
  prepareErrorHttpRequest(404, msg, cb)
}

function ok(json, cb) {
  prepareHttpRequest(200, json, cb)
}

function created(json, cb) {
  prepareHttpRequest(201, json, cb)
}

function deleted(cb) {
  cb(null, {
    statusCode: 204
  });
}
module.exports = {
  prepareHttpRequest,
  prepareErrorHttpRequest,
  notFound,
  ok,
  created,
  deleted
}
