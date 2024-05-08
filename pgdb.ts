import { Client } from 'pg';
import * as dotenv from 'dotenv';

// 加载.env文件中的环境变量
dotenv.config();

// 数据库配置
const config = {
  user: process.env.DB_USER, // 从环境变量读取用户名
  host: process.env.DB_HOST, // 从环境变量读取数据库服务器地址
  password: process.env.DB_PASSWORD, // 从环境变量读取密码
  port: parseInt(process.env.DB_PORT || '5432'), // 从环境变量读取端口号，如果不存在则默认为5432
};

async function createDatabaseAndSchema() {
  // 连接到PostgreSQL服务器
  const client = new Client({
    ...config,
    database: 'postgres', // 默认连接到postgres数据库
  });

  try {
    await client.connect(); // 开始连接

    // 创建新数据库
    const dbName = 'newDatabase'; // 新数据库的名称
    await client.query(`CREATE DATABASE ${dbName}`);

    // 连接到新数据库
    const dbClient = new Client({
      ...config,
      database: dbName,
    });
    await dbClient.connect();

    // 创建schema
    const schemaName = 'newSchema'; // 新schema的名称
    await dbClient.query(`CREATE SCHEMA ${schemaName}`);

    console.log(`Database ${dbName} and schema ${schemaName} created successfully.`);
    
    // 断开数据库连接
    await dbClient.end();
  } catch (error) {
    console.error('Error creating database or schema:', error);
  } finally {
    await client.end(); // 总是确保断开初始连接
  }
}

createDatabaseAndSchema();
