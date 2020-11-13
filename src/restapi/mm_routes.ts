import fs from 'fs';

import express, { Request, Response } from 'express';

import app from '../app/app';
import http from '../app/http';

const router = express.Router();

router.get('/', (req: Request, res) => {
    res.send('Matterost!');
});

router.post('/createform', (req: Request, res: Response) => {
    if (req.body.type == 'form') {
        // const formData = app.getCreateForm(req.body.context.post.message)
        fs.readFile('create_form.json', (err, data) => {
            if (err) {
                throw err;
            }
            const formData = JSON.parse(data.toString());
            formData.form.fields[2].value = req.body.context.post.message;
            res.json(formData);
        });
    } else {
        const { acting_user_id, post_id, team_id, channel_id } = req.body.context;
        const values = req.body.values
        const ticket = app.getTicketForPost(values)
        app.createTicketFromPost(ticket, channel_id, acting_user_id, post_id);
        res.sendStatus(200);
    }
});

router.get('/mattermost-app.json', (req: Request, res: Response) => {
    fs.readFile('manifest.json', (err, data) => {
        if (err) {
            throw err;
        }
        const manifest = JSON.parse(data.toString());
        res.json(manifest);
    });
});

router.get('/bindings', (req: Request, res: Response) => {
    fs.readFile('bindings.json', (err, data) => {
        if (err) {
            throw err;
        }
        const bindings = JSON.parse(data.toString());
        res.json(bindings);
    });
});

router.get('/install', (req: Request, res: Response) => {
    http.installApp();
    const manifest = '/install post';
    res.send(manifest);
});

// router.post('/trigger/create', async (req, res) => {
//     client.triggers.create();
// });

router.post('/notify/user_left_channel', async (req: Request, res: Response) => {
    // const post = await Client4.getPost(req.body.values.post_id);
    console.log('req', req);
    res.send('user XXX left channel XXX');

    // res.json({"user XXX join the channel"});
});

router.post('/notify/user_joined_channel', async (req: Request, res: Response) => {
    // const post = await Client4.getPost(req.body.values.post_id);
    console.log('req', req);
    res.send('user XXX joined channel XXX');
    res.json({});
});

export default router;
