'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Info, 
  AlertCircle, 
  Award, 
  FileText,
  Calendar,
  Trash2,
  Filter,
  MoreHorizontal
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
  id: string
  type: string
  message: string
  read: boolean
  createdAt: Date
}

interface NotificationsListProps {
  notifications: Notification[]
  userRole: string
}

export function NotificationsList({ notifications, userRole }: NotificationsListProps) {
  const [notificationsList, setNotificationsList] = useState(notifications)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [isLoading, setIsLoading] = useState(false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'APPLICATION_UPDATE':
        return FileText
      case 'SCHOLARSHIP_ALERT':
        return Award
      case 'SYSTEM_ANNOUNCEMENT':
        return Info
      case 'REMINDER':
        return Calendar
      default:
        return Bell
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'APPLICATION_UPDATE':
        return 'text-blue-600 bg-blue-100'
      case 'SCHOLARSHIP_ALERT':
        return 'text-green-600 bg-green-100'
      case 'SYSTEM_ANNOUNCEMENT':
        return 'text-orange-600 bg-orange-100'
      case 'REMINDER':
        return 'text-purple-600 bg-purple-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const markAsRead = async (notificationId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      })

      if (response.ok) {
        setNotificationsList(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true }
              : notification
          )
        )
        toast.success('Notification marked as read')
      } else {
        toast.error('Failed to mark notification as read')
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Failed to mark notification as read')
    } finally {
      setIsLoading(false)
    }
  }

  const markAllAsRead = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT'
      })

      if (response.ok) {
        setNotificationsList(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        )
        toast.success('All notifications marked as read')
      } else {
        toast.error('Failed to mark all notifications as read')
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast.error('Failed to mark all notifications as read')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setNotificationsList(prev => 
          prev.filter(notification => notification.id !== notificationId)
        )
        toast.success('Notification deleted')
      } else {
        toast.error('Failed to delete notification')
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredNotifications = notificationsList.filter(notification => {
    if (filter === 'unread') return !notification.read
    if (filter === 'read') return notification.read
    return true
  })

  const unreadCount = notificationsList.filter(n => !n.read).length

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-2">
              {unreadCount > 0 
                ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                : 'You\'re all caught up!'
              }
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              onClick={markAllAsRead} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all', label: 'All', count: notificationsList.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'read', label: 'Read', count: notificationsList.length - unreadCount }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                filter === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <Badge className="ml-2" variant="secondary">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'unread' 
                  ? 'No unread notifications' 
                  : filter === 'read' 
                    ? 'No read notifications'
                    : 'No notifications yet'
                }
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                {filter === 'unread' 
                  ? 'You\'re all caught up! New notifications will appear here.'
                  : filter === 'read' 
                    ? 'No notifications have been read yet.'
                    : 'When you receive notifications, they\'ll appear here.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type)
            const colorClass = getNotificationColor(notification.type)
            
            return (
              <Card 
                key={notification.id} 
                className={`transition-all hover:shadow-md ${
                  !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {notification.type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(notification.id)}
                              disabled={isLoading}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteNotification(notification.id)}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Statistics */}
      {notificationsList.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Notification Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{notificationsList.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
                <div className="text-sm text-gray-600">Unread</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {notificationsList.length - unreadCount}
                </div>
                <div className="text-sm text-gray-600">Read</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {notificationsList.filter(n => n.type === 'SCHOLARSHIP_ALERT').length}
                </div>
                <div className="text-sm text-gray-600">Scholarship Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
