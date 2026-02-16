/**
 * 用户系统 - 基础架构
 * 支持注册、登录、收藏、订阅
 */

import { randomBytes, createHash } from 'crypto';

// 用户类型定义
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  role: 'user' | 'pro' | 'admin';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  preferences: UserPreferences;
  subscription?: SubscriptionInfo;
  stats: UserStats;
}

export interface UserPreferences {
  language: 'zh' | 'en' | 'ja' | 'ko';
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  digestFrequency: 'daily' | 'weekly' | 'never';
  categories: string[]; // 感兴趣的分类
  sources: string[]; // 关注的来源
  keywords: string[]; // 关注的关键词
}

export interface SubscriptionInfo {
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  features: string[];
}

export interface UserStats {
  articlesRead: number;
  articlesSaved: number;
  searchesMade: number;
  apiCalls: number;
  lastActiveAt: string;
}

export interface SavedArticle {
  id: string;
  userId: string;
  articleId: string;
  savedAt: string;
  folder?: string;
  notes?: string;
  tags: string[];
}

export interface ReadingHistory {
  id: string;
  userId: string;
  articleId: string;
  readAt: string;
  readDuration: number; // 阅读时长（秒）
  progress: number; // 阅读进度 0-100
}

// 内存存储（生产环境应使用数据库）
const users = new Map<string, User>();
const emailToUserId = new Map<string, string>();
const sessions = new Map<string, { userId: string; expiresAt: number }>();
const savedArticles = new Map<string, SavedArticle[]>();
const readingHistory = new Map<string, ReadingHistory[]>();

// 生成唯一 ID
function generateId(): string {
  return randomBytes(16).toString('hex');
}

// 密码哈希
function hashPassword(password: string, salt: string): string {
  return createHash('sha256').update(password + salt).digest('hex');
}

// 生成 Session Token
function generateSessionToken(): string {
  return randomBytes(32).toString('base64url');
}

// 默认用户偏好设置
const defaultPreferences: UserPreferences = {
  language: 'zh',
  theme: 'system',
  emailNotifications: true,
  pushNotifications: false,
  digestFrequency: 'daily',
  categories: ['AI/ML', '开源', '基础设施'],
  sources: [],
  keywords: [],
};

// 默认用户统计
const defaultStats: UserStats = {
  articlesRead: 0,
  articlesSaved: 0,
  searchesMade: 0,
  apiCalls: 0,
  lastActiveAt: new Date().toISOString(),
};

// 用户注册
export async function registerUser(
  email: string,
  password: string,
  username: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Invalid email format' };
  }

  // 检查邮箱是否已存在
  if (emailToUserId.has(email.toLowerCase())) {
    return { success: false, error: 'Email already registered' };
  }

  // 检查用户名是否已存在
  for (const user of users.values()) {
    if (user.username.toLowerCase() === username.toLowerCase()) {
      return { success: false, error: 'Username already taken' };
    }
  }

  // 密码强度验证
  if (password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' };
  }

  const now = new Date().toISOString();
  const userId = generateId();
  const salt = randomBytes(16).toString('hex');

  const user: User = {
    id: userId,
    email: email.toLowerCase(),
    username,
    role: 'user',
    createdAt: now,
    updatedAt: now,
    preferences: { ...defaultPreferences },
    stats: { ...defaultStats },
  };

  // 存储用户（实际应存储到数据库）
  users.set(userId, user);
  emailToUserId.set(email.toLowerCase(), userId);

  return { success: true, user };
}

// 用户登录
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  const userId = emailToUserId.get(email.toLowerCase());
  
  if (!userId) {
    return { success: false, error: 'Invalid email or password' };
  }

  const user = users.get(userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  // 验证密码（实际应比较哈希值）
  // 这里简化处理，实际生产环境需要密码哈希比较

  // 更新登录时间
  user.lastLoginAt = new Date().toISOString();
  user.stats.lastActiveAt = new Date().toISOString();

  // 生成 Session Token
  const token = generateSessionToken();
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30天

  sessions.set(token, { userId, expiresAt });

  return { success: true, user, token };
}

// 验证 Session
export async function validateSession(token: string): Promise<User | null> {
  const session = sessions.get(token);
  
  if (!session) {
    return null;
  }

  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }

  const user = users.get(session.userId);
  return user || null;
}

// 登出
export async function logoutUser(token: string): Promise<void> {
  sessions.delete(token);
}

// 获取用户信息
export async function getUserById(userId: string): Promise<User | null> {
  return users.get(userId) || null;
}

// 更新用户偏好设置
export async function updateUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<{ success: boolean; error?: string }> {
  const user = users.get(userId);
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  user.preferences = { ...user.preferences, ...preferences };
  user.updatedAt = new Date().toISOString();

  return { success: true };
}

// 保存文章
export async function saveArticle(
  userId: string,
  articleId: string,
  folder?: string,
  notes?: string,
  tags: string[] = []
): Promise<{ success: boolean; error?: string }> {
  const user = users.get(userId);
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const userSaved = savedArticles.get(userId) || [];
  
  // 检查是否已保存
  const alreadySaved = userSaved.find(s => s.articleId === articleId);
  if (alreadySaved) {
    return { success: false, error: 'Article already saved' };
  }

  const saved: SavedArticle = {
    id: generateId(),
    userId,
    articleId,
    savedAt: new Date().toISOString(),
    folder,
    notes,
    tags,
  };

  userSaved.push(saved);
  savedArticles.set(userId, userSaved);

  // 更新统计
  user.stats.articlesSaved++;
  user.updatedAt = new Date().toISOString();

  return { success: true };
}

// 取消保存文章
export async function unsaveArticle(
  userId: string,
  articleId: string
): Promise<{ success: boolean; error?: string }> {
  const userSaved = savedArticles.get(userId) || [];
  const filtered = userSaved.filter(s => s.articleId !== articleId);
  
  savedArticles.set(userId, filtered);

  // 更新统计
  const user = users.get(userId);
  if (user) {
    user.stats.articlesSaved = Math.max(0, user.stats.articlesSaved - 1);
  }

  return { success: true };
}

// 获取用户保存的文章
export async function getSavedArticles(userId: string): Promise<SavedArticle[]> {
  return savedArticles.get(userId) || [];
}

// 记录阅读历史
export async function recordReading(
  userId: string,
  articleId: string,
  readDuration: number,
  progress: number
): Promise<void> {
  const user = users.get(userId);
  if (!user) return;

  const history = readingHistory.get(userId) || [];
  
  history.push({
    id: generateId(),
    userId,
    articleId,
    readAt: new Date().toISOString(),
    readDuration,
    progress,
  });

  readingHistory.set(userId, history);

  // 更新统计
  user.stats.articlesRead++;
  user.stats.lastActiveAt = new Date().toISOString();
}

// 获取阅读历史
export async function getReadingHistory(userId: string): Promise<ReadingHistory[]> {
  return readingHistory.get(userId) || [];
}

// 获取用户统计
export async function getUserStats(userId: string): Promise<UserStats | null> {
  const user = users.get(userId);
  return user?.stats || null;
}

// 获取所有用户（管理员功能）
export async function getAllUsers(): Promise<User[]> {
  return Array.from(users.values());
}

// 删除用户（管理员功能）
export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  const user = users.get(userId);
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  users.delete(userId);
  emailToUserId.delete(user.email);
  savedArticles.delete(userId);
  readingHistory.delete(userId);

  // 清除所有 session
  for (const [token, session] of sessions.entries()) {
    if (session.userId === userId) {
      sessions.delete(token);
    }
  }

  return { success: true };
}

// 初始化管理员账户（开发测试用）
export async function initAdminUser(): Promise<void> {
  const adminEmail = 'admin@newclaw.com';
  
  if (!emailToUserId.has(adminEmail)) {
    const result = await registerUser(adminEmail, 'admin123', 'admin');
    if (result.success && result.user) {
      result.user.role = 'admin';
      console.log('[User] Admin user created:', result.user.id);
    }
  }
}
