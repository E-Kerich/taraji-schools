import { useEffect, useState } from 'react';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { Download, Mail, Calendar, Filter, Users, TrendingUp, Eye, Trash2 } from 'lucide-react';

const EmailList = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState('all');

  useEffect(() => {
    fetchEmails();
  }, [selectedSource]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const url = selectedSource === 'all' 
        ? '/emails' 
        : `/emails?source=${selectedSource}`;
      
      const res = await api.get(url);
      setEmails(res.data.data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const exportCSV = () => {
    const headers = ['Email', 'Source', 'Subscribed At', 'Status'];

    const rows = emails.map(e => [
      e.email,
      e.source || 'unknown',
      new Date(e.createdAt).toLocaleDateString(),
      e.status || 'active'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `brookside-emails-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  const deleteEmail = async (id) => {
    if (!window.confirm('Are you sure you want to remove this email from the list?')) return;
    
    try {
      await api.delete(`/emails/${id}`);
      setEmails(prev => prev.filter(e => e._id !== id));
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  const unsubscribeEmail = async (id) => {
    try {
      await api.put(`/emails/${id}`, { status: 'unsubscribed' });
      setEmails(prev =>
        prev.map(e => e._id === id ? { ...e, status: 'unsubscribed' } : e)
      );
    } catch (error) {
      console.error('Error unsubscribing email:', error);
    }
  };

  const getSourceIcon = (source) => {
    switch(source) {
      case 'website': return '🌐';
      case 'admissions': return '📚';
      case 'events': return '🎉';
      case 'newsletter': return '📰';
      default: return '📧';
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'unsubscribed') {
      return (
        <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
          Unsubscribed
        </div>
      );
    }
    return (
      <div className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
        Active
      </div>
    );
  };

  const columns = [
    { 
      key: 'email', 
      label: 'Email',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <Mail className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.email}</div>
            <div className="text-sm text-gray-500">{getStatusBadge(row.status)}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'source', 
      label: 'Source',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">{getSourceIcon(row.source)}</span>
          <span className="text-gray-700 capitalize">{row.source || 'Unknown'}</span>
        </div>
      )
    },
    { 
      key: 'date', 
      label: 'Subscribed',
      render: (row) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <div>
            <div className="text-sm">{formatDate(row.createdAt)}</div>
            {row.subscribedAt && (
              <div className="text-xs text-gray-500">
                {new Date(row.subscribedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status !== 'unsubscribed' && (
            <button
              onClick={() => unsubscribeEmail(row._id)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Unsubscribe"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => deleteEmail(row._id)}
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const sources = ['all', 'website', 'admissions', 'events', 'newsletter', 'contact_form'];

  // Calculate stats
  const activeSubscribers = emails.filter(e => e.status !== 'unsubscribed').length;
  const thisWeek = emails.filter(e => {
    const date = new Date(e.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date > weekAgo;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-gray-900">Email Subscribers</h1>
          <p className="text-gray-600 mt-1">Manage newsletter and communication list</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg 
                   hover:bg-red-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="text-2xl font-light text-gray-900">{emails.length}</div>
          <div className="text-sm text-gray-600">Total Subscribers</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="text-2xl font-light text-gray-900">{activeSubscribers}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="text-2xl font-light text-gray-900">{thisWeek}</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="text-2xl font-light text-gray-900">
            {Math.round((activeSubscribers / emails.length) * 100) || 0}%
          </div>
          <div className="text-sm text-gray-600">Active Rate</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border border-gray-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Filter by source:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {sources.map(source => (
            <button
              key={source}
              onClick={() => setSelectedSource(source)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedSource === source
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {source === 'all' ? 'All Sources' : source.replace('_', ' ')}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSelectedSource('all')}
          className="ml-auto px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Clear Filter
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-100">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading subscribers...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={emails}
            searchable={true}
            selectable={true}
          />
        )}
      </div>

      {/* Additional Actions */}
      <div className="flex flex-wrap gap-4">
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
          <Mail className="w-4 h-4" />
          Send Test Email
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
          <Users className="w-4 h-4" />
          Create Segment
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
          <TrendingUp className="w-4 h-4" />
          View Analytics
        </button>
      </div>
    </div>
  );
};

export default EmailList;