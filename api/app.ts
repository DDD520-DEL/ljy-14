/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { initDatabase } from './db/database.js'
import authRoutes from './routes/auth.js'
import teamsRoutes from './routes/teams.js'
import votesRoutes from './routes/votes.js'
import rankingRoutes from './routes/ranking.js'
import mapRoutes from './routes/map.js'
import battleRoutes from './routes/battle.js'
import commentsRoutes from './routes/comments.js'
import invitationsRoutes from './routes/invitations.js'
import usersRoutes from './routes/users.js'
import postsRoutes from './routes/posts.js'
import friendshipsRoutes from './routes/friendships.js'
import notificationsRoutes from './routes/notifications.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * Database initialization
 */
initDatabase().catch(console.error);

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/teams', teamsRoutes)
app.use('/api/votes', votesRoutes)
app.use('/api/ranking', rankingRoutes)
app.use('/api/map', mapRoutes)
app.use('/api/battle', battleRoutes)
app.use('/api', commentsRoutes)
app.use('/api/invitations', invitationsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/friendships', friendshipsRoutes)
app.use('/api/notifications', notificationsRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

export default app
