import { useEffect, useState } from 'react';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Filter, 
  Eye, 
  MailOpen,
  User,
  Building,
  Calendar,
  Trash2,
  ChevronDown,
  MoreVertical,
  Reply,
  AlertCircle,
  BarChart3,
  Users,
  Mailbox,
  RefreshCw,
  Download,
  X
} from 'lucide-react';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [selectedStatus]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const url = selectedStatus === 'all' 
        ? '/contact' 
        : `/contact?status=${selectedStatus}`;
      
      const res = await api.get(url);
      setContacts(res.data.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const markResponded = async (id) => {
    try {
      const res = await api.put(`/contact/${id}`, {
        status: 'responded'
      });
      setContacts(prev =>
        prev.map(c => (c._id === id ? res.data.data : c))
      );
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = contacts
        .filter(c => c.status === 'new')
        .map(c => c._id);
      
      if (unreadIds.length === 0) return;
      
      if (window.confirm(`Mark ${unreadIds.length} message(s) as read?`)) {
        await Promise.all(
          unreadIds.map(id => 
            api.put(`/contact/${id}`, { status: 'responded' })
          )
        );
        fetchContacts();
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await api.delete(`/contact/${id}`);
      setContacts(prev => prev.filter(c => c._id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedContacts.length} message(s)?`)) return;
    
    try {
      await Promise.all(
        selectedContacts.map(id => api.delete(`/contact/${id}`))
      );
      setSelectedContacts([]);
      fetchContacts();
    } catch (error) {
      console.error('Error bulk deleting:', error);
    }
  };

  const handleBulkMarkAsRead = async () => {
    if (selectedContacts.length === 0) return;
    
    try {
      await Promise.all(
        selectedContacts.map(id => 
          api.put(`/contact/${id}`, { status: 'responded' })
        )
      );
      setSelectedContacts([]);
      fetchContacts();
    } catch (error) {
      console.error('Error bulk marking as read:', error);
    }
  };

  const toggleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(c => c._id));
    }
  };

  const toggleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const toggleSelectContact = (id) => {
    setSelectedContacts(prev => 
      prev.includes(id) 
        ? prev.filter(contactId => contactId !== id)
        : [...prev, id]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return 'Just now';
    }
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    if (diffDays === 1) {
      return 'Yesterday';
    }
    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    if (status === 'responded') {
      return (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
          <CheckCircle className="w-3 h-3" />
          <span className="hidden sm:inline">Responded</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
        <Clock className="w-3 h-3" />
        <span className="hidden sm:inline">New</span>
      </div>
    );
  };

  // Mobile Card View Component
  const ContactCard = ({ contact }) => (
    <div className={`bg-white border rounded-lg p-4 mb-4 ${contact.status === 'new' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={selectedContacts.includes(contact._id)}
              onChange={() => toggleSelectContact(contact._id)}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            {getStatusBadge(contact.status)}
          </div>
          <h3 className="text-sm font-medium text-gray-900 truncate mb-1">{contact.name}</h3>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span className="truncate">{contact.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(contact.createdAt)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => toggleRowExpand(contact._id)}
          className="ml-2 p-1 text-gray-400 hover:text-gray-600"
        >
          <ChevronDown className={`w-5 h-5 transform transition-transform ${expandedRow === contact._id ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Subject */}
      {contact.subject && (
        <div className="mb-2">
          <div className="text-xs text-gray-500 mb-1">Subject:</div>
          <div className="text-sm font-medium text-gray-900">{contact.subject}</div>
        </div>
      )}

      {/* Campus */}
      {contact.campus && (
        <div className="mb-2">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Building className="w-3 h-3" />
            <span>{contact.campus}</span>
          </div>
        </div>
      )}

      {/* Phone */}
      {contact.phone && (
        <div className="mb-2">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Phone className="w-3 h-3" />
            <span>{contact.phone}</span>
          </div>
        </div>
      )}

      {/* Message Preview */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-1">Message:</div>
        <p className="text-sm text-gray-700 line-clamp-2">{contact.message}</p>
      </div>

      {/* Expanded Content */}
      {expandedRow === contact._id && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">Full Message:</div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.message}</p>
          </div>
          
          <div className="text-xs text-gray-500">
            Received: {formatFullDate(contact.createdAt)}
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.open(`mailto:${contact.email}?subject=Re: ${contact.subject || 'Your message'}`)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            >
              <Reply className="w-4 h-4" />
              Reply
            </button>
            <button
              onClick={() => markResponded(contact._id)}
              disabled={contact.status === 'responded'}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded transition-colors ${
                contact.status === 'responded'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              {contact.status === 'responded' ? <CheckCircle className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
              {contact.status === 'responded' ? 'Read' : 'Mark as Read'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                alert(contact.message);
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Full
            </button>
            <button
              onClick={() => deleteContact(contact._id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons - Collapsed */}
      {expandedRow !== contact._id && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(`mailto:${contact.email}?subject=Re: ${contact.subject || 'Your message'}`)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Reply"
            >
              <Reply className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                alert(contact.message);
              }}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="View Message"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => markResponded(contact._id)}
              disabled={contact.status === 'responded'}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                contact.status === 'responded'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {contact.status === 'responded' ? 'Read' : 'Mark Read'}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const columns = [
    {
      key: 'selection',
      label: '',
      className: 'w-10',
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedContacts.includes(row._id)}
          onChange={() => toggleSelectContact(row._id)}
          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
        />
      )
    },
    { 
      key: 'name', 
      label: 'Contact',
      className: 'min-w-[200px]',
      render: (row) => (
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${row.status === 'new' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'}`}>
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 truncate">{row.name}</div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span className="truncate">{row.email}</span>
              </div>
              {row.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{row.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    },
    { 
      key: 'subject', 
      label: 'Subject',
      className: 'hidden lg:table-cell',
      render: (row) => (
        <div className="max-w-xs">
          <div className="text-gray-900 truncate">{row.subject || 'No subject'}</div>
          <div className="text-sm text-gray-600 truncate">{row.message.substring(0, 50)}...</div>
        </div>
      )
    },
    { 
      key: 'campus', 
      label: 'Campus',
      className: 'hidden md:table-cell',
      render: (row) => (
        <div className="text-gray-700 flex items-center gap-1">
          <Building className="w-4 h-4 text-gray-400" />
          {row.campus || 'Not specified'}
        </div>
      )
    },
    { 
      key: 'date', 
      label: 'Received',
      className: 'hidden sm:table-cell',
      render: (row) => (
        <div className="text-sm text-gray-600 flex items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{formatDate(row.createdAt)}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      className: 'hidden sm:table-cell',
      render: (row) => (
        <div className="flex flex-col gap-2">
          {getStatusBadge(row.status)}
          {row.status === 'new' && (
            <button
              onClick={() => markResponded(row._id)}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors whitespace-nowrap"
            >
              Mark Read
            </button>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => window.open(`mailto:${row.email}?subject=Re: ${row.subject || 'Your message'}`)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Reply"
            >
              <Reply className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                alert(row.message);
              }}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="View Message"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteContact(row._id)}
              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          {/* Mobile dropdown menu */}
          <div className="md:hidden relative">
            <button
              onClick={() => toggleRowExpand(row._id)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      )
    }
  ];

  const statuses = ['all', 'new', 'responded'];

  // Calculate stats
  const newMessages = contacts.filter(c => c.status === 'new').length;
  const respondedMessages = contacts.filter(c => c.status === 'responded').length;
  const responseRate = contacts.length > 0 ? Math.round((respondedMessages / contacts.length) * 100) : 0;
  const westlandsMessages = contacts.filter(c => c.campus === 'Westlands').length;
  const redhillMessages = contacts.filter(c => c.campus === 'Redhill').length;

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-light text-gray-900">Contact Messages</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Messages from the website contact form</p>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedContacts.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                {selectedContacts.length} selected
              </span>
              <button
                onClick={handleBulkMarkAsRead}
                className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
              >
                Mark as Read
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedContacts([])}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <button
            onClick={markAllAsRead}
            className="px-4 py-2.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
          <div className="text-lg sm:text-xl md:text-2xl font-light text-gray-900">{contacts.length}</div>
          <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
            <Mailbox className="w-3 h-3" />
            Total Messages
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
          <div className="text-lg sm:text-xl md:text-2xl font-light text-gray-900">{newMessages}</div>
          <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            New
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
          <div className="text-lg sm:text-xl md:text-2xl font-light text-gray-900">{respondedMessages}</div>
          <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Responded
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
          <div className="text-lg sm:text-xl md:text-2xl font-light text-gray-900">{responseRate}%</div>
          <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            Response Rate
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
          <div className="text-lg sm:text-xl md:text-2xl font-light text-gray-900">{westlandsMessages + redhillMessages}</div>
          <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
            <Building className="w-3 h-3" />
            With Campus
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="sm:hidden">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transform transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filters & Bulk Actions */}
      <div className={`${showMobileFilters ? 'block' : 'hidden'} sm:block bg-white rounded-lg border border-gray-100 p-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Show:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedStatus === status
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? 'All Messages' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={fetchContacts}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Select All Bar */}
      <div className="bg-white rounded-lg border border-gray-100 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedContacts.length === contacts.length && contacts.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">
              {selectedContacts.length > 0 
                ? `${selectedContacts.length} of ${contacts.length} selected`
                : 'Select all messages'}
            </span>
          </div>
          {selectedContacts.length > 0 && (
            <button
              onClick={() => setSelectedContacts([])}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear selection
            </button>
          )}
        </div>
      </div>

      {/* Data Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-8 text-center">
            <Mailbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-600">No contact messages match your filters.</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={contacts}
            searchable={true}
            searchPlaceholder="Search messages..."
            selectable={true}
            pagination={true}
            itemsPerPage={10}
            className="text-sm"
          />
        )}
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        ) : contacts.length > 0 ? (
          <div>
            {contacts.map(contact => (
              <ContactCard key={contact._id} contact={contact} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Mailbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-600 mb-6">No contact messages match your filters.</p>
            <button
              onClick={() => setSelectedStatus('all')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg 
                       hover:bg-red-700 transition-colors"
            >
              View All Messages
            </button>
          </div>
        )}
      </div>

      {/* Mobile Load More */}
      {!loading && contacts.length > 5 && (
        <div className="lg:hidden text-center">
          <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Load More Messages
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactList;