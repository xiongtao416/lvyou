/**
 * 游记相关 Mock 数据
 */

import type { Note } from '@/types'

/**
 * 游记详情
 */
export const mockNoteData: Partial<Note> = {
  coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop',
  title: '武功山三天两夜徒步攻略｜云海之上，星空之下',
  authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  authorName: '山野旅人',
  publishTime: '2026-04-15',
  views: 2340,
  likes: 186,
  content: `
    <p>武功山，位于江西省萍乡市，是中国十大非著名山峰之一。</p>
    <p>三天两夜的徒步穿越，让我领略了高山草甸的壮美。</p>
    <h3>行程安排</h3>
    <p>Day 1: 萍乡集合，出发前往登山口...</p>
    <p>Day 2: 穿越草甸，夜宿金顶...</p>
    <p>Day 3: 观日出，下撤返程...</p>
  `,
  images: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&h=600&fit=crop'
  ]
}

/**
 * 游记列表
 */
export const mockNoteList = [
  {
    _id: '1',
    title: '武功山三天两夜徒步攻略',
    cover: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
    author: '山野旅人',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    likes: 186,
    views: 2340
  },
  {
    _id: '2',
    title: '黄山日出最佳观赏点推荐',
    cover: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
    author: '摄影达人',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    likes: 245,
    views: 3120
  }
]
