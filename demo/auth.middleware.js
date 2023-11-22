

const ApiGateway = require('moleculer-web');

async function checkAuthMiddleware(ctx, route, req, res) {
 
  if (!ctx.meta.isAuthenticated) {
  
    res.writeHead(302, {
      'Location': '/login.html', 
    });
    res.end();
  }
}

module.exports = checkAuthMiddleware;
