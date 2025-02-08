import express from 'express'
import { processAddress, getPortfolioVelcroV3 } from '../lib/utils/portfolio'
import { askGemini } from '../lib/utils/geminiAI'

const port = 3420

const app = express()

app.use(express.json())

app.post('/', async (req, res) => {
    const { address } = req.body
    const data = await processAddress({
        address,
        getPortfolio: getPortfolioVelcroV3,
        llmProcessor: askGemini
    })
    res.send(data)
})

app.listen(port, () => {
    console.log(`AdEx aura app listening on port ${port}`)
})
