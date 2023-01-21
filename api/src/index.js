import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import routes from "./routes.js"

const server = express()
server.use(express.json())
server.use(cors())
server.use(routes)

server.listen(process.env.PORT || '5172')