const fs = require('fs');

const express = require('express');

const utils = require('../utils/util');
const app = require('../app/app');
const http = require('../app/http');

const router = new express.Router();

router.get('/', (req, res) => {
    res.send('Matterost!');
});

router.post('/post', async (req, res) => {
    const post = await Client4.getPost(req.body.values.post_id);
    utils.openInteractiveDialog(getDialogConfig(req.body.trigger_id, post));
    res.json({});
});

router.post('/openform', (req, res) => {
    // const {acting_user_id, post_id, team_id, channel_id} = req.body.context;

    fs.readFile('open_form.json', (err, data) => {
        if (err) {
            throw err;
        }
        const manifest = JSON.parse(data);
        manifest.form.fields[1].value = req.body.context.post.message;

        res.json(manifest);
    });
});

router.post('/create', (req, res) => {
    const {acting_user_id, post_id, team_id, channel_id} = req.body.context;
    const ticket = {
        ticket: {
            subject: 'Ticket Created from Mattermost',
            comment: {
                body: 'this is the description',
            },
        },
    };

    app.createTicketFromPost(ticket, channel_id, acting_user_id, post_id);
    res.sendStatus(200);
});

router.get('/mattermost-app.json', (req, res) => {
    fs.readFile('manifest.json', (err, data) => {
        if (err) {
            throw err;
        }
        const manifest = JSON.parse(data);
        res.json(manifest);
    });
});

router.get('/bindings', (req, res) => {
    fs.readFile('bindings.json', (err, data) => {
        if (err) {
            throw err;
        }
        const bindings = JSON.parse(data);
        res.json(bindings);
    });
});

router.get('/install', (req, res) => {
    http.installApp();
    const manifest = '/install post';
    res.send(manifest);
});

router.post('/trigger/create', async (req, res) => {
    client.triggers.create();
});

router.post('/notify/user_left_channel', async (req, res) => {
    // const post = await Client4.getPost(req.body.values.post_id);
    console.log('req', req);
    res.send('user XXX left channel XXX');

    // res.json({"user XXX join the channel"});
});

router.post('/notify/user_joined_channel', async (req, res) => {
    // const post = await Client4.getPost(req.body.values.post_id);
    console.log('req', req);
    res.send('user XXX joined channel XXX');
    res.json({});
});

module.exports = router;
