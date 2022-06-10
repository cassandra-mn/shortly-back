import {nanoid} from 'nanoid';

import connection from '../db.js';

export async function postUrl(req, res) {
    const {url} = req.body;
    const {id} = res.locals;
    const shortUrl = nanoid(8);
    try {
        await connection.query('INSERT INTO urls (url, "shortUrl", "userId") VALUES ($1, $2, $3)', [url, shortUrl, id]);
        res.status(201).send({shortUrl});
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function urlById(req, res) {
    const {shortUrl} = req.params;
    try {
        const url = await connection.query('SELECT id, "shortUrl", url FROM urls WHERE "shortUrl" = $1', [shortUrl]);
        res.status(200).send(url.rows[0]);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function openUrl(req, res) {
    const {shortUrl} = req.params;
    const {url} = res.locals;
    const {url: link, visitCount} = url;
    try {
        await connection.query('UPDATE urls SET "visitCount" = $1 WHERE "shortUrl" = $2', [visitCount + 1, shortUrl]);
        res.redirect(link);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function deleteUrl(req, res) {
    const {id, url} = res.locals;
    try {
        if (id !== url.userId) return res.sendStatus(401);
        await connection.query('DELETE FROM urls WHERE id = $1', [url.id]);
        res.sendStatus(204);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}