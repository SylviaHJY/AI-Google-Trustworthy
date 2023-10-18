import { MongoClient } from 'mongodb';
import fs from 'fs/promises';

// 读取 JSON 文件
const data = JSON.parse(await fs.readFile('Dementia.json', 'utf8'));

// 连接到 MongoDB
const client = await MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true });
const db = client.db('FirstRound');
const collection = db.collection('answers');

// 插入数据
await collection.insertMany(data);

console.log('Data imported successfully');
client.close();

