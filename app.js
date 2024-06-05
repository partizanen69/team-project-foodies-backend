import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';

import categoriesRouter from './routes/categoriesRouter.js';
import usersRouter from './routes/usersRouter.js';
import recipesRouter from './routes/recipesRouter.js';

const { DB_CONNECTION_STRING, PORT = 3000 } = process.env;

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/users', usersRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/categories', categoriesRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

mongoose
  .connect(DB_CONNECTION_STRING)
  .then(() => {
    console.log('Database connection successful');
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  })
  .catch(error => {
    console.log(
      'Could not connect to the mongodb database because of error',
      error.message
    );
    process.exit(1);
  });

mongoose.set('debug', true);
