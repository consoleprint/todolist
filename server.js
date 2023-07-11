const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});
var db = {}
async function setupDB() {
    try {
        db.Task = sequelize.define('Task', {
            text: {
                type: DataTypes.STRING,
                allowNull: false
            },
        });

        await sequelize.sync({ force: true });
        await db.Task.create({ text: "Dental"});
        await db.Task.create({ text: "Return Book"});
        await db.Task.create({ text: "Finish this course"});

    } catch (error) {
        console.error(error);
    }
}

async function startServer() {
    try {
        await setupDB()
        const port = 3001
        const express = require('express')
        const app = express()
        app.use(express.json());

        app.get('/', (req, res) => {
            res.send('hello world')
        })
        app.get('/api/tasks', (req, res) => {
            db.Task.findAll().then(tasks => {
                res.json(tasks)
            })
        })
        app.post('/api/tasks', (req, res) => {
            db.Task.create(req.body).then(task => {
                res.json(task)
            })
        })
        app.get('/api/tasks/:id', (req, res) => {
            db.Task.findOne({
                where: {
                    id: req.params.id
                },
            }).then(t => {
                res.json(t)
            });
        })
        app.delete('/api/tasks/:id', (req, res) => {
            db.Task.destroy({
                where: {
                    id: req.params.id
                },
            }).then(count => {
                if (!count) {
                    return res.status(404).send({error: 'No Tasks'});
                   }
                res.status(204).send();
            });
        })
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    } catch (error) {
        console.error(error);
    }
}

startServer()