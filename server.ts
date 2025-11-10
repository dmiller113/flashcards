import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 2020;
const buildDirectoryPath = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	'build',
);

app.use(cors());

app.use(express.static(buildDirectoryPath));
console.dir(`Listening on 127.0.0.1:${PORT}`);

app.listen(PORT);

