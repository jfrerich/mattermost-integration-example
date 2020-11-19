import express, { Request, Response } from 'express';

import app from '../app/app';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send('ZenDesk!');
});

router.post('/webhook', (req: Request, res: Response) => {
    app.createPostFromWebhook(req);
    res.send('nice');
});

// router.post('/trigger/create', async (req, res) => {
//     client.triggers.create();
// });

export default router;
