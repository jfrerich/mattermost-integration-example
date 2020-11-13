import zendesk from 'node-zendesk';
import { Client, ClientOptions } from 'node-zendesk'

const username = process.env.ZENDESK_USERNAME;
const token = process.env.ZENDESK_API_TOKEN;
const apiURL = process.env.ZENDESK_URL + '/api/v2';

const options: ClientOptions = {
    username: username,
    token: token,
    remoteUri: apiURL,
}

function newClient(): Client {
    return zendesk.createClient(options);
}

export default newClient();