const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()

app.get('/', (_req, res) => {
    return res.sendFile(__dirname + '/index.html')
})

app.get('/stream', (req, res) => {
    const range = req.headers.range
    const videoPath = path.resolve(__dirname, 'videos', 'Francesco.mp4')
    const videoSize = fs.statSync(videoPath).size

    const CHUNK_SIZE = 10000
    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1)

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Range": 'bytes',
        "Content-type": 'audio/mpeg'
    }

    res.writeHead(206, headers)

    const videoStream = fs.createReadStream(videoPath, { start, end })

    videoStream.pipe(res)

})

app.listen(3334)