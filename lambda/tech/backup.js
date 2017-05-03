const Backup = require('dynamodb-backup-restore').Backup;

const tableName = ["peoples", "experiences"]

const region = 'ap-southeast-2'

const configs = tableName.map(table => {
  return  {
      S3Bucket: 'octolog-db-backup',
      S3Prefix: table,
      S3Region: region,
      DbTable:  table,
      DbRegion: region
  };
})

let backup = configs.map(config => new Backup(config))


function doBackup() {
  const date = new Date().toISOString()
  console.log(date)
  const configs = tableName.map(table => {
    return  {
        S3Bucket: process.env.BACKUP_BUCKET,
        S3Prefix: '/' + date + '/' + table,
        S3Region: region,
        DbTable:  table,
        DbRegion: region
    };
  })
  backup.forEach(backup => backup.full())
}

module.exports.backup = function(event, context, callback) {
  doBackup()
  callback();
}
