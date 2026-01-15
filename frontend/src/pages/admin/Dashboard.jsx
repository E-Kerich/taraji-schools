import { useEffect, useState } from 'react';
import api from '../../services/api';
import StatCard from '../../components/admin/StatCard';
import { FileText, MessageSquare, Phone, CreditCard, Users, Eye, Mail, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/dashboard/summary?period=${period}`);
      setStats(res.data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    
    if (typeof num === 'number') {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toLocaleString();
    }
    return num;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your admin panel</p>
        </div>
        
        {/* Period Selector */}
        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-4 py-2 text-sm rounded transition-colors ${
                period === p.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Blogs"
          value={formatNumber(stats?.blogs || 0)}
          subtitle={`${stats?.publishedBlogs || 0} published`}
          icon={<FileText className="w-5 h-5" />}
          color="blue"
          loading={loading}
        />
        
        <StatCard
          title="New Inquiries"
          value={formatNumber(stats?.newInquiries || 0)}
          subtitle="Awaiting follow-up"
          icon={<MessageSquare className="w-5 h-5" />}
          color="green"
          loading={loading}
        />
        
        <StatCard
          title="Contact Messages"
          value={formatNumber(stats?.newContacts || 0)}
          subtitle="Unread messages"
          icon={<Phone className="w-5 h-5" />}
          color="purple"
          loading={loading}
        />
        
        <StatCard
          title="Payments"
          value={formatCurrency(stats?.paymentsThisMonth || 0)}
          subtitle="This month"
          icon={<CreditCard className="w-5 h-5" />}
          color="red"
          loading={loading}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Website Traffic</h3>
            <Eye className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-2xl font-light text-gray-900 mb-2">
            {formatNumber(stats?.websiteVisitors || 0)}
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">
              +12% from last month
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Email Subscribers</h3>
            <Mail className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-2xl font-light text-gray-900 mb-2">
            {formatNumber(stats?.emailSubscribers || 0)}
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">
              +5% from last week
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Active Users</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-2xl font-light text-gray-900 mb-2">
            {formatNumber(stats?.activeUsers || 0)}
          </div>
          <div className="text-sm text-gray-600">
            24h active users
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h3 className="font-medium text-gray-900 mb-6">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-gray-100 rounded-lg">
            <div className="text-lg font-medium text-gray-900">
              {formatNumber(stats?.responseRate || 0)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Response Rate</div>
          </div>
          
          <div className="text-center p-4 border border-gray-100 rounded-lg">
            <div className="text-lg font-medium text-gray-900">
              {formatNumber(stats?.avgResponseTime || 0)}h
            </div>
            <div className="text-sm text-gray-600 mt-1">Avg. Response Time</div>
          </div>
          
          <div className="text-center p-4 border border-gray-100 rounded-lg">
            <div className="text-lg font-medium text-gray-900">
              {formatNumber(stats?.conversionRate || 0)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Conversion Rate</div>
          </div>
          
          <div className="text-center p-4 border border-gray-100 rounded-lg">
            <div className="text-lg font-medium text-gray-900">
              {formatNumber(stats?.engagementRate || 0)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Engagement Rate</div>
          </div>
        </div>
      </div>

      {/* Recent Activity Preview */}
      {stats?.recentActivity && stats.recentActivity.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h3 className="font-medium text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <activity.icon className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;