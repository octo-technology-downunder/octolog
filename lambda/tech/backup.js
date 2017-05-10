const Backup = require('dynamodb-backup-restore').Backup;

const tableName = ["peoples", "experiences"]

const region = 'ap-southeast-2'

function doBackup() {
  const date = new Date().toISOString()
  const configs = tableName.map(table => {
    return  {
        S3Bucket: process.env.BACKUP_BUCKET,
        S3Prefix: '/' + date + '/' + table,
        S3Region: region,
        DbTable:  table,
        DbRegion: region
    };
  })
  let backup = configs.map(config => new Backup(config))
  return Promise.all(backup.map(backup => backup.full()))
}

module.exports.backup = function(event, context, callback) {
  doBackup()
    .then(v => callback(null))
    .catch(callback)
}
