# Blank String Data

This is where all the data for the episodes lives

## Build

in order to generate `index.json` simply run `npm run build`

## Create

run `npm run new` to create a new episode, it will start a command prompt to guide you

## Usage

```js
const data = require('data')
```

this data has everything which is needed for the rss feed and where to find the files

## Versioning

`S.E.F`

* `S` refers to the schema, if `Sb` > `Sa` then `Sb` is not backwards compatable with `Sa`
* `E` refers to the latest episode number
* `F` is any modifications to any episode which does not add a new episode or change the schema, it may change the values in the data

This way you can keep track of where your data is and if it is behind

Just commit any scripts or script fixes and when the next episode is released it will be picked up. We don't mind about tagging these things as this repo is about the data. But if you want to tag them then chanhe `Z`