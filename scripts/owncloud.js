const path = require('path')
const fs = require('fs')
const createClient = require('webdav')

const username = process.env.OWNCLOUD_USERNAME
const password = process.env.OWNCLOUD_PASSWORD
const url = process.env.OWNCLOUD_URL

const client = createClient(
  url,
  username,
  password
)

function humanFileSize (bytes, si) {
  var thresh = si ? 1000 : 1024
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }
  var units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  var u = -1
  do {
    bytes /= thresh
    ++u
  } while (Math.abs(bytes) >= thresh && u < units.length - 1)
  return bytes.toFixed(1) + units[u]
}

const message = {}

const get = (episode, filename) => {
  const url = `blankstring/episodes/${episode}`

  client.stat(url)
    .then(data => {
      const length = data.size
      const y = humanFileSize(data.size, true)
      return new Promise((resolve, reject) => {
        let size = 0
        const stream = client.createReadStream(`blankstring/episodes/${episode}`)
        stream.pipe(fs.createWriteStream(path.resolve(__dirname, filename)))

        stream.on('data', (chunk) => {
          size += chunk.length
          const x = humanFileSize(size, true)

          const p = (size / length).toFixed(2)

          message[filename] = `${filename} ${x} ${y} ${p}%`
          const str = Object.keys(message)
            .sort()
            .map(key => message[key])
            .join('\n')

          process.stdout.write(`\n${str}`)
        })

        stream.on('end', () => {
          resolve({ episode, filename })
        })

        stream.on('error', err => {
          reject(err)
        })
      })
    }).then(({ episode, filename }) => {
      console.log(`episode ${episode} written to ${filename}`)
    }).catch((err) => {
      console.log(`episode ${episode} failed ${err}`)
    })
}

get('e000/blankstring-e000.mp3', 'e000.mp3')
get('e001/blankstring-e001.mp3', 'e001.mp3')
get('e002/blankstring-e002.mp3', 'e002.mp3')
