/**
 * 数据库配置 - SQLite
 * 零配置，数据存储在本地文件
 */
require('dotenv').config()
const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '../../data/database.db')

const db = new Database(DB_PATH)

// 启用WAL模式提升性能
db.pragma('journal_mode = WAL')

// 初始化表结构
db.exec(`
  CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    images TEXT DEFAULT '[]',
    tags TEXT DEFAULT '[]',
    cover TEXT DEFAULT '',
    startDate TEXT NOT NULL,
    startTime TEXT DEFAULT '',
    endDate TEXT DEFAULT '',
    location TEXT NOT NULL,
    meetingPoint TEXT DEFAULT '',
    price REAL DEFAULT 0,
    feeInclude TEXT DEFAULT '[]',
    feeExclude TEXT DEFAULT '[]',
    maxParticipants INTEGER DEFAULT 50,
    participantCount INTEGER DEFAULT 0,
    organizer TEXT DEFAULT '{}',
    description TEXT DEFAULT '',
    itinerary TEXT DEFAULT '[]',
    notices TEXT DEFAULT '[]',
    participants TEXT DEFAULT '[]',
    status TEXT DEFAULT 'registering',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    createTime TEXT DEFAULT (datetime('now', 'localtime')),
    updateTime TEXT DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    nickname TEXT NOT NULL,
    name TEXT DEFAULT '',
    avatar TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    gender INTEGER DEFAULT 0,
    department TEXT DEFAULT '',
    idCard TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    role TEXT DEFAULT 'user',
    stats TEXT DEFAULT '{"joinCount":0,"upcomingCount":0,"noteCount":0}',
    status TEXT DEFAULT 'active',
    createTime TEXT DEFAULT (datetime('now', 'localtime')),
    updateTime TEXT DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS registrations (
    id TEXT PRIMARY KEY,
    activityId TEXT NOT NULL,
    userId TEXT DEFAULT '',
    userName TEXT NOT NULL,
    userPhone TEXT NOT NULL,
    userAvatar TEXT DEFAULT '',
    department TEXT DEFAULT '',
    userCount INTEGER DEFAULT 1,
    totalPrice REAL DEFAULT 0,
    remark TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    createTime TEXT DEFAULT (datetime('now', 'localtime')),
    updateTime TEXT DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    activityId TEXT DEFAULT '',
    authorId TEXT DEFAULT '',
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    images TEXT DEFAULT '[]',
    coverImage TEXT DEFAULT '',
    tags TEXT DEFAULT '[]',
    authorName TEXT DEFAULT '',
    authorAvatar TEXT DEFAULT '',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    favorites INTEGER DEFAULT 0,
    commentCount INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    createTime TEXT DEFAULT (datetime('now', 'localtime')),
    updateTime TEXT DEFAULT (datetime('now', 'localtime'))
  );
`)

console.log('✅ SQLite 数据库连接成功:', DB_PATH)

module.exports = db
