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
    try {
        res.sendStatus(501);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}