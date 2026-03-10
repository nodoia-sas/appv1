import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
}

export default function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { name, data } = req.body;
            if (!data || !name) {
                return res.status(400).json({ error: 'Missing data' });
            }
            const base64Data = data.replace(/^data:image\/png;base64,/, "");
            // Ensure public/icons exists
            const dir = path.join(process.cwd(), 'public', 'icons');
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            const filePath = path.join(dir, name);
            fs.writeFileSync(filePath, base64Data, 'base64');
            console.log(`[TempSave] Saved ${name} to ${filePath}`);
            res.status(200).json({ success: true, path: filePath });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message });
        }
    } else {
        res.status(405).end();
    }
}
