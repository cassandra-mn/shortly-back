import {v4 as uuid} from 'uuid';
import bcrypt from 'bcrypt';

import connection from '../db.js';

export async function signUp(req, res) {
    const {name, email} = req.body;
    try {
        const password = bcrypt.hashSync(req.body.password, 10);
        await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, password]);
        res.sendStatus(201);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function signIn(req, res) {
    const {email, password} = req.body;
    try {
        const user = await connection.query('SELECT * FROM users WHERE "email" = $1', [email]);
        if (!user.rows[0] || !bcrypt.compareSync(password, user.rows[0].password)) return res.sendStatus(401);
        await connection.query('INSERT INTO sessions (token, "userId") VALUES ($1, $2)', [uuid(), user.rows[0].id]);       
        res.status(200).send(uuid());
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}