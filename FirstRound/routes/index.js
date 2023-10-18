import answersRoutes from './answers.js';
import usersRoutes from './users.js';
import ratingsRoutes from './ratings.js';
import loginRoutes from './login.js';

const constructorMethod = (app) => {
    app.use('/answers', answersRoutes);
    app.use('/users', usersRoutes);
    app.use('/ratings', ratingsRoutes);
    app.use('/login', loginRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

export default constructorMethod;