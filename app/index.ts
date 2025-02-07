import express from 'express'

const app = express()
const port = 3420

app.get('/', (req, res) => {
    res.send('Aura here!')
})

app.listen(port, () => {
    console.log(`AdEx aura app listening on port ${port}`)
})
