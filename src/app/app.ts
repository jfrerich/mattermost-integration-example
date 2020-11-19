import zendeskClient from '../zendesk/client';
import mmClient from '../mattermost/client';

import fs from 'fs';

import { Post } from 'mattermost-redux/types/posts'

const username = process.env.ZENDESK_USERNAME as string;
const token = process.env.ZENDESK_API_TOKEN as string;
const apiURL = process.env.ZENDESK_URL + '/api/v2' as string;

class App {
    // createTicketFromPost
    async createTicketFromPost(ticket, channelId: string, userId: string, postId: string) {
        const zdClient = zendeskClient(username, token, apiURL)
        const result = await zdClient.tickets.create(ticket);
        const user = await zdClient.users.show(result.requester_id);
        const host = process.env.ZENDESK_URL;

        const message = `${user.name} created ticket [#${result.id}](${host}/agent/tickets/${result.id}) [${result.subject}]`;

        const post: Post = {
            message: message,
            channel_id: channelId,
            user_id: userId,
            root_id: postId,
        }

        const pRes = mmClient.createPost(post);
    }

    getTicketForPost(values) {
        const zdSubject = values.subject
        const mmSignature = "*message created from Mattermost message.*"

        const zdMessage = values.additional_message + "\n"
            + values.post_message + "\n"
            + mmSignature

        const ticket = {
            ticket: {
                subject: zdSubject,
                comment: {
                    body: zdMessage
                },
            },
        };
        return ticket
    }

    // createTicketFromWebhook
    getCreateForm(message: string) {
        console.log("message", message)
        const value = fs.readFile('create_form.json', (err, data) => {
            if (err) {
                console.log('err', err)
                throw err;
            }
            return JSON.parse(data.toString());
        });

        return value
    }
}

export default new App();
