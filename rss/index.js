const path = require('path')
const fs = require('fs-extra')
const mustache = require('mustache')
const chalk = require('chalk')
const moment = require('moment')
const data = require('data')

module.exports = directory => {
    if (typeof directory === 'undefined') {
        console.log(chalk.red('You need to pass in a directory'))
        process.exit(1)
    }

    const outDir = path.resolve(process.cwd(), directory)
    const itemPath = path.resolve(__dirname, 'item.xml')
    const itemTemplate = fs.readFileSync(itemPath).toString()
    mustache.parse(itemTemplate)

    const rssPath = path.resolve(__dirname, 'body.xml')
    const rssTemplate = fs.readFileSync(rssPath).toString()
    mustache.parse(rssTemplate)

    const error = (fileName, message) => {
        console.log(chalk.yellow(fileName), chalk.red(message))
        process.exit(0)
    }

    const item = (d) => {
        console.log(chalk.cyan('creating'), chalk.yellow(d.name))
        return mustache.render(itemTemplate, {
            title: d.title,
            pubDate: moment(d.time).format('ddd, DD MMM YYYY HH:mm:ss +0000'),
            guid: d.guid,
            link: `http://blankstring.com/${d.name}`,
            description: d.description,
            mp3Length: d.mp3Length,
            mp3: `http://blankstring.com/static/media/${d.name}.mp3`,
            duration: d.duration,
            subtitle: d.subtitle
        })
    }

    const rss = () => {
        const items = data.map(item).join('\n')
        return mustache.render(rssTemplate, {
            lastBuildDate: moment().format('ddd, DD MMM YYYY HH:mm:ss +0000'),
            items
        })
    }

    const result = rss()
    const output = path.resolve(outDir, 'rss.xml')
    fs.writeFileSync(output, result)
    console.log(chalk.cyan('wirtten to'), chalk.yellow(output))
}