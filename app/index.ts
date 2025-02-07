import express from 'express'
import { processAddress } from '../lib/utils/portfolio'

const app = express()
const port = 3420

app.get('/', async (req, res) => {
    const data = await processAddress()
    res.send(data)
})

app.listen(port, () => {
    console.log(`AdEx aura app listening on port ${port}`)
})
