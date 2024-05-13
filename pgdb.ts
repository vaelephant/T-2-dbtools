import { Client } from 'pg';
import * as dotenv from 'dotenv';

// 加载.env文件中的环境变量
dotenv.config();

// 输出环境变量的值
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_PORT:', process.env.DB_PORT);

// 数据库配置
const config = {
  user: process.env.DB_USER, // 从环境变量读取用户名
  host: process.env.DB_HOST, // 从环境变量读取数据库服务器地址
  password: process.env.DB_PASSWORD, // 从环境变量读取密码
  port: parseInt(process.env.DB_PORT || '5432'), // 从环境变量读取端口号，如果不存在则默认为5432

};

async function checkSchemaExists(client: Client, schemaName: string) {
  const res = await client.query("SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1", [schemaName]);
  return res.rows.length > 0;
}

async function createDatabase(dbName: string) {
  const client = new Client({
    ...config,
    database: 'postgres', // 默认连接到postgres数据库
  });

  try {
    await client.connect();
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`Database ${dbName} created successfully.`);
    return client; // 返回客户端对象
  } catch (error) {
    console.error('Error creating database:', error);
    throw error; // 抛出错误
  }
}

async function createSchema(client: Client, dbName: string, schemaName: string) {
  try {
    console.log(`Database ${dbName} created successfully.`);
    
    const schemaExists = await checkSchemaExists(client, schemaName);
    if (schemaExists) {
      console.log(`Schema ${schemaName} already exists.`);
      return; // 跳过创建模式的步骤
    }

    // 使用指定的数据库连接创建模式
    await client.query(`CREATE SCHEMA ${schemaName}`);
    console.log(`Schema ${schemaName} in database ${dbName} created successfully.`);
  } catch (error) {
    console.error('Error creating schema:', error); // 输出错误消息的详细描述
    throw error; // 抛出错误
  }
}



// 使用例子
async function setupDatabase() {
  const dbName = 'newDatabase1234';
  const schemaName = "newSchema123456";
  
  try {
    const client = await createDatabase(dbName);
    await createSchema(client, dbName, schemaName);
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}



setupDatabase();
