import Router from 'express';

const testRouter = Router();

testRouter.get('/', (req, res) => {
  res.send('Test route');
});

export default testRouter;

