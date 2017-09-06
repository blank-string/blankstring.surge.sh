const fs = require('fs')
const path = require('path')

data = fs.readdirSync(__dirname)
    .filter(file => file.match(/^e\d+\.json$/g) !== null)
    .map(file => require(path.join(__dirname, file)))
    .sort((left, right) => {
        if (left.time < right.time) return 1
        if (left.time > right.time) return -1
        return 0
    })


fs.writeFileSync(path.resolve(__dirname, 'index.json'), JSON.stringify(data, null, 4))
