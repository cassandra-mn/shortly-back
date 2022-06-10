import userSchema from '../schemas/userSchema.js';
import urlSchema from '../schemas/urlSchema.js';
import connection from '../db.js';

export async function validateUser(req, res, next) {
    const {error} = userSchema.validate(req.body, {abortEarly: false});
    if (error) return res.status(422).send(error.details.map(detail => detail.message));
    next();
}

export async function validateUrl(req, res, next) {
    const {error} = urlSchema.validate(req.body, {abortEarly: false});
    if (error) return res.status(422).send(error.details.map(detail => detail.message));
    next();
}

export async function existUrl(req, res, next) {
    const {shortUrl} = req.params;
    try {
        const req = await connection.query('SELECT * FROM urls WHERE "shortUrl" = $1', [shortUrl]);
        if (!req.rows[0]) return res.sendStatus(404);
        const url = req.rows[0];
        res.locals.url = url; 
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
    next();
}

export async function validateHeader(req, res, next) {
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer ', '');
    try {
        const isValid = await connection.query('SELECT * FROM sessions WHERE token = $1', [token]);
        if (!authorization || !isValid.rows[0]) return res.sendStatus(401);
        const id = isValid.rows[0].userId;
        res.locals.id = id;
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
    next();
}