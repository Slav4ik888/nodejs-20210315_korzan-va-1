const Router = require('koa-router');
// Models
const Session = require('../models/Session');
// Libs
const handleMongooseValidationError = require('../libs/validationErrors');
const mustBeAuthenticated = require('../libs/mustBeAuthenticated');
// Controllers
const { recommendationsList } = require('../controllers/recommendations');
const { productsBySubcategory, productsByQuery, productList, productById } = require('../controllers/products');
const { categoryList } = require('../controllers/categories');
const { login } = require('../controllers/login');
const { oauth, oauthCallback } = require('../controllers/oauth');
const { me } = require('../controllers/me');
const { register, confirm } = require('../controllers/registration');
const { checkout, getOrdersList } = require('../controllers/orders');
const { messageList } = require('../controllers/messages');


const router = new Router({ prefix: '/api' });

router.use(async (ctx, next) => {
  console.log(`Router >>>`);

  const header = ctx.request.get('Authorization');
  if (!header) return next();
  console.log(`Есть header = Authorization`);

  const token = header.split(' ')[1];
  if (!token) return ctx.throw(401, "anonymous sessions are not allowed");
  // if (!token) return next();
  console.log(`Есть token`);

  const session = await Session.findOne({ token }).populate('user');
  if (!session) {
    ctx.throw(401, 'wrong or expired session token');
  }
  session.lastVisit = new Date();
  await session.save();

  ctx.user = session.user;
  console.log('session.user: ', session.user.email);

  return next();
});

router.get('/recommendations', recommendationsList);
router.get('/categories', categoryList);
router.get('/products', productsBySubcategory, productsByQuery, productList);
router.get('/products/:id', productById);

router.post('/login', login);

router.get('/oauth/:provider', oauth);
router.post('/oauth_callback', handleMongooseValidationError, oauthCallback);

router.get('/me', mustBeAuthenticated, me);

router.post('/register', handleMongooseValidationError, register);
router.post('/confirm', confirm);

router.get('/orders', mustBeAuthenticated, getOrdersList);
router.post('/orders', mustBeAuthenticated, handleMongooseValidationError, checkout);

router.get('/messages', messageList);

module.exports = router;