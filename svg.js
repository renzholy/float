/* eslint-disable no-restricted-syntax */

const fsWalk = require('@nodelib/fs.walk')
const fs = require('fs')
const _ = require('lodash')

const output = 'assets/icons/index.ts'

function rename(path) {
  return _.upperFirst(
    _.camelCase(path.replace(/^assets\/icons\//, '').replace(/\.svg$/, '')),
  )
}

fsWalk.walk('assets/icons', (error, entries) => {
  if (error) {
    console.error(error)
    return
  }
  fs.writeFileSync(
    output,
    '/** This file is generated by svg.js. DO NOT MODIFY * */\n\n',
  )
  for (const entry of entries) {
    if (entry.dirent.isFile() && entry.name.endsWith('.svg')) {
      fs.appendFileSync(
        output,
        `import Icon${rename(entry.path)} from './${entry.path.replace(
          /^assets\/icons\//,
          '',
        )}'\n`,
      )
    }
  }
  fs.appendFileSync(output, '\nexport {\n')
  for (const entry of entries) {
    if (entry.dirent.isFile() && entry.name.endsWith('.svg')) {
      fs.appendFileSync(output, `  Icon${rename(entry.path)},\n`)
    }
  }
  fs.appendFileSync(output, '}\n')
})
