const fs = require('fs')
const path = require('path')
const md5 = require('md5')
const prompt = require('prompt')
const mp3Duration = require('mp3-duration')

const next = () => {
    let latest = fs.readdirSync(__dirname)
        .filter(file => file.match(/^e\d+\.json$/g) !== null)
        .sort()
        .reverse()[0]
        .replace('e', '')
        .replace('.json', '')

    latest = parseInt(latest) + 1
    if (latest < 10) latest = '00' + latest
    else if (latest < 100) latest = '0' + latest
    return `e${latest}`
}

const timeFormat = (time) => {
    let hrs = ~~(time / 3600)
    if (hrs < 10) hrs = '0' + hrs

    let mins = ~~((time % 3600) / 60)
    if (mins < 10) mins = '0' + mins

    let secs = time % 60
    if (secs < 10) mins = '0' + mins

    return `${hrs}:${mins}:${secs}`
}

const create = (result) => {
    const episode = {}
    episode.name = result.name
    episode.title = result.title
    episode.subtitle = result.subtitle
    episode.description = result.description
    episode.time = new Date().getTime()
    episode.guid = md5(result.name)
    mp3Duration(result.mp3Location, function (err, duration) {
        if (err) {
            console.error(err.message)
            process.exit(1)
        }
        duration = Math.ceil(duration)
        episode.mp3Length = duration
        episode.duration = timeFormat(duration)
        fs.writeFileSync(
            path.resolve(__dirname, `${episode.name}.json`),
            JSON.stringify(episode, null, 4)
        )
        console.log('created', episode.name)
    })
}

const getMp3 = (previous, failedLocation) => {
    const getMp3Schema = {
        properties: {
            mp3Location: {
                require: true,
                before: path.resolve,
                description: `Sorry, ${failedLocation} does not exist, try again`
            }
        }
    }
    prompt.start()
    prompt.get([getMp3Schema], (err, result) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        if (!fs.existsSync(result.mp3Location)) getMp3(result.mp3Location)
        else create(Object.assign({}, previous, result))
    })
}

const schema = {
    properties: {
        name: {
            pattern: /^\d\d\d$/,
            message: 'Must be three digits long',
            description: `What is the name of the episode (press enter for ${next()})`
        },
        title: {
            required: true
        },
        subtitle: {
            required: true
        },
        description: {
            required: true
        },
        mp3Location: {
            required: true,
            before: path.resolve
        }
    }
}

prompt.start()
prompt.get(schema, (err, result) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    if (result.name === '') result.name = next()
    if (!fs.existsSync(result.mp3Location)) getMp3(result, result.mp3Location)
    else create(result)
})
