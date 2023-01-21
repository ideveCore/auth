import express from 'express'
import * as EmailValidator from 'email-validator'
import jwt from 'jsonwebtoken'
import { secret } from './config/jwt_token.js'
import { send } from './send_email.js'
import bcrypt from "bcryptjs";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const router = express.Router()

/*
  +++++++++++++++++++++++++++
  ===== TEST ROUTER API =====
  +++++++++++++++++++++++++++
*/

router.get('/default/test/api', async (request, response) => {
  return response.status(200).json({
    status: 'running',
    message: 'API running with success!'
  })
})

/*
  +++++++++++++++++++++++++++++
  ===== REGISTER NEW USER =====
  +++++++++++++++++++++++++++++
*/

router.post('/user/new', async (request, response) => {
  try {
    const { first_name, last_name, email, password } = request.body
    const is_validated = validate_data({ first_name, last_name, email, password })

    if (!is_validated) {
      return response.status(400).json({
        message: "Data is incomplete!"
      })
    }

    const encrypted_password = await bcrypt.hash(password, 10)

    const already_user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })
    if (already_user) {
      return response.status(400).json({
        message: "This user already registred!"
      })
    }
    const new_user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: encrypted_password
      }
    })

    const sent_email = await send_email(new_user)
    if (sent_email) {
      return response.status(200).json({
        message: 'Registered user, a validation email has been sent, check your email box.'
      })
    }
  } catch (error) {
    console.log(error)
    return response.status(400).json({
      message: 'Not possible register this user, unexpected error!'
    })
  }
})

/*
  +++++++++++++++++++++++++
  ===== VALIDATE USER =====
  +++++++++++++++++++++++++
*/

router.post('/user/validate', async (request, response) => {
  try {
    const { token } = request.body
    jwt.verify(token, secret, async (error, decoded) => {
      if (error) {
        return response.status(400).json({
          message: error.message
        })
      }
      try {
        const user_updated = await prisma.user.update({
          where: {
            id: decoded.id
          },
          data: {
            verified_email: true
          }
        })
        if (!user_updated) {
          return response.status(400).json({
            message: 'Unexpected error, could not verify this email, please try again'
          })
        }
        return response.status(200).json({
          message: 'The email has been successfully verified, you are now enabled to use our platforms'
        })
      } catch (error) {
        return response.status(400).json({
          message: 'Not possible register this user, unexpected error!'
        })
      }
    })
  } catch (error) {
    return response.status(400).json({
      message: 'Not possible register this user, unexpected error!'
    })
  }
})

/*
  ++++++++++++++++++++++
  ===== LOGIN USER =====
  ++++++++++++++++++++++
*/

router.post('/user/login', async (request, response) => {
  try {
    const { email, password } = request.body
    const user = await prisma.user.findUnique({
      where: {
        email,
      }
    })
    if (!user) {
      return response.status(400).json({
        message: 'User not found!'
      })
    }
    if (!await bcrypt.compare(password, user.password)) {
      return response.status(400).json({
        message: 'Invalid password!'
      })
    }
    if (!user.verified_email) {
      const sent_email = await send_email(user)
      if (sent_email) {
        return response.status(401).json({
          message: 'Unverified user, a validation email has been sent, check your email box.'
        })
      }
    }
    const token = await jwt.sign({ id: user.id }, secret, {
      expiresIn: 2592000
    })
    return response.status(200).json({
      token,
      message: 'Successful login.'
    })
  } catch (error) {
    return response.status(400).json({
      message: 'Unexpected error!'
    })
  }
})

/*
  +++++++++++++++++++++++++++++++++++++++
  ===== VALIDATE TOKEN FROM COOKIES =====
  +++++++++++++++++++++++++++++++++++++++
*/

router.post('/user/validate/token', async (request, response) => {
  try {
    const { token } = request.body
    jwt.verify(token, secret, async (error, decoded) => {
      if (error) {
        return response.status(400).json({
          message: error.message
        })
      }
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id
        },
        select: {
          password: false,
          id: false,
          first_name: true,
          last_name: true,
          email: true,
          verified_email: false
        }
      })
      if (!user || user === "") {
        return response.status(400).json({
          message: 'User not found!'
        })
      }
      return response.status(200).json({
        authenticated: true,
        user,
        message: 'User authenticated successfully'
      })
    })
  } catch (error) {
    return response.status(400).json({
      message: 'Unexpected error!'
    })
  }
})

const validate_data = (data) => {
  if (!data.first_name || data.first_name.trim() === "") return false
  if (!data.last_name || data.last_name.trim() === "") return false
  if (!EmailValidator.validate(data.email.trim())) return false
  if (!data.password || data.password.trim() === "") return false
  return true
}

const send_email = async (user) => {
  const token = await jwt.sign({ id: user.id }, secret, {
    expiresIn: 300
  })
  await send(token, user)
  return true
}

export default router