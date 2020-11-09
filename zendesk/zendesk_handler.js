const zendesk = require('node-zendesk');

const {request} = require('express');

const utils = require('../util');
const Client4 = require('../client');

const username = process.env.ZENDESK_USERNAME;
const token = process.env.ZENDESK_API_TOKEN;
const apiURL = process.env.ZENDESK_URL + '/api/v2';

const client = zendesk.createClient({
    username,
    token,
    remoteUri: apiURL,
});

module.exports.routes = (router) => {
    router.get('/', (req, res) => {
        res.send('ZenDesk!');
    });

    router.post('/post', async (req, res) => {
        const post = await Client4.getPost(req.body.values.post_id);
        utils.openInteractiveDialog(getDialogConfig(req.body.trigger_id, post));
        res.json({});
    });

    router.post('/webhook', (req, res) => {
        res.send('nice');
    });

    router.post('/create', async (req, res) => {
        const {subject, description, type, post_id} = req.body.submission;
        const {channel_id, user_id} = req.body;

        const ticket = {
            ticket: {
                type,
                subject,
                comment: {
                    body: description,
                },
            },
        };

        let requester_id;
        await client.tickets.create(ticket).
            then((result) => {
                const host = process.env.ZENDESK_URL;
                requester_id = result.requester_id;
                const message = `${result.requester_id} Created a new ticket (${result.id})! [${subject}](${host}/agent/tickets/${result.id})`;
                const pRes = Client4.createPost({
                    message,
                    channel_id,
                    user_id,
                    root_id: post_id,
                });

            // console.log(JSON.stringify(result, null, 2, true));//gets the first page
            }).
            catch((error) => {
                console.log(error);
            });

        // client.users.show(result.requester_id, function (err, req, result) {
        client.users.list((err, req, result) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(JSON.stringify(result[0], null, 2, true));//gets the first page
        });

        console.log('2. requester_id', requester_id);
        client.users.show(requester_id, (err, req, result) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(JSON.stringify(result[0], null, 2, true));//gets the first page
        });
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

    // Subjects to implement (notify/subject)
    // SubjectUserCreated       = Subject("user_created")
    // SubjectUserJoinedChannel = Subject("user_joined_channel")Lev, 15 days ago: • MM-29348: Finish the install flow POC (#20)
    // SubjectUserLeftChannel   = Subject("user_left_channel")
    // SubjectUserJoinedTeam    = Subject("user_joined_team")
    // SubjectUserLeftTeam      = Subject("user_left_team")
    // SubjectUserUpdated       = Subject("user_updated")
    // SubjectChannelCreated    = Subject("channel_created")
    // SubjectPostCreated       = Subject("post_created")
};

function handleError(err) {
    console.log(err);
    process.exit(-1);
}
