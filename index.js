const express = require('express')
const app = express()
const fs = require("fs")
const path = require("path")

app.use('/', express.static('doc'))
app.use('/schemas', express.static('schemas'))
app.use('/redoc', express.static('./node_modules/redoc/bundles'))

app.listen(process.env.PORT || 8080)
