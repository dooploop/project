// auth.service.js
const { Service } = require("moleculer");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');

module.exports = {
  name: 'auth',

  settings: {
    session: {
      secret: 'woneit123',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    },
  },

  actions: {

    login: {
          rest: {
            method: "POST",
            path: "/login",
          },
    async handler(ctx) {
      const { username, password } = ctx.params;

      // логика проверки пользователя в базе данных
    
      if (username === 'user' && password === 'password') {
      
        const token = this.generateToken(username);

  
      //  ctx.session.isAuthenticated = true; -тут проблема
       // ctx.session.token = token; и тут

        return { token };
      } else {
     
        throw new Error('Invalid username or password');
      }
    },
    },

    async checkAuth(ctx) {
      if (ctx.session.isAuthenticated) {
        return { status: 'authenticated' };
      } else {
        return { status: 'not authenticated' };
      }
    },
  },

  methods: {
    generateToken(username) {
      
      const payload = { sub: username };
      return jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' });
    },
  },

};
