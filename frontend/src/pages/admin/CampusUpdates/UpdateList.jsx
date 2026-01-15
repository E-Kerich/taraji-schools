import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { 
  Plus, 
  Calendar, 
  Building, 
  Tag, 
  Eye, 
  Edit, 
  Trash2, 
  Filter, 
  TrendingUp,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  ChevronDown,
  MoreVertical,
  BarChart3,
  Bell,
  Award,
  Megaphone
} from 'lucide-react';

const UpdateList = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchUpdates();
  }, [selectedCampus, selectedType]);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      let url = '/campus-updates';
      
      if (selectedCampus !== 'all' || selectedType !== 'all') {
        const params = new URLSearchParams();
        if (selectedCampus !== 'all') params.append('campus', selectedCampus);
        if (selectedType !== 'all') params.append('type', selectedType);
        url += `?${params.toString()}`;
      }
      
      const res = await api.get(url);
      setUpdates(res.data.data);
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this update?')) return;
    
    try {
      await api.delete(`/campus-updates/${id}`);
      setUpdates(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting update:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const toggleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    
    try {
      await api.put(`/campus-updates/${id}`, { published: newStatus });
      setUpdates(prev =>
        prev.map(item => (item._id === id ? { ...item, published: newStatus } : item))
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Event': return <Calendar className="w-4 h-4" />;
      case 'Announcement': return <Megaphone className="w-4 h-4" />;
      case 'News': return <FileText className="w-4 h-4" />;
      case 'Achievement': return <Award className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Event': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Announcement': return 'bg-green-50 text-green-700 border-green-200';
      case 'News': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Achievement': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Mobile Card View Component
  const UpdateCard = ({ update }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-2 py-1 ${getTypeColor(update.type)} text-xs font-medium rounded-full border`}>
              {getTypeIcon(update.type)}
              <span className="hidden xs:inline">{update.type}</span>
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${update.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {update.published ? 'Published' : 'Draft'}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-900 truncate mb-1">{update.title}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Building className="w-3 h-3" />
              <span>{update.campus}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(update.createdAt)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => toggleRowExpand(update._id)}
          className="ml-2 p-1 text-gray-400 hover:text-gray-600"
        >
          <ChevronDown className={`w-5 h-5 transform transition-transform ${expandedRow === update._id ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Summary */}
      {update.summary && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{update.summary}</p>
      )}

      {/* Expanded Content */}
      {expandedRow === update._id && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
          {update.summary && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Summary:</p>
              <p className="text-sm text-gray-700">{update.summary}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.open(`/updates/${update._id}`, '_blank')}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
            <button
              onClick={() => toggleStatus(update._id, update.published)}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded transition-colors ${
                update.published
                  ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              {update.published ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {update.published ? 'Unpublish' : 'Publish'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to={`/admin/campus-updates/edit/${update._id}`}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={() => handleDelete(update._id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons - Collapsed */}
      {expandedRow !== update._id && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(`/updates/${update._id}`, '_blank')}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <Link
              to={`/admin/campus-updates/edit/${update._id}`}
              className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => handleDelete(update._id)}
              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => toggleStatus(update._id, update.published)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              update.published
                ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            {update.published ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      )}
    </div>
  );

  const campuses = ['all', 'Westlands', 'Redhill'];
  const types = ['all', 'Event', 'Announcement', 'News', 'Achievement'];

  const columns = [
    { 
      key: 'title', 
      label: 'Title',
      className: 'min-w-[200px]',
      render: (row) => (
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${getTypeColor(row.type).replace('text-', 'bg-').split(' ')[0]}`}>
            {getTypeIcon(row.type)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 truncate">{row.title}</div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                <Building className="w-3 h-3" />
                <span>{row.campus}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(row.createdAt)}</span>
              </div>
            </div>
            {row.summary && (
              <div className="hidden sm:block text-sm text-gray-600 truncate mt-1">{row.summary}</div>
            )}
          </div>
        </div>
      )
    },
    { 
      key: 'type', 
      label: 'Type',
      className: 'hidden md:table-cell',
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(row.type)}`}>
          {row.type}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      className: 'hidden sm:table-cell',
      render: (row) => (
        <div className="flex flex-col gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            row.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {row.published ? 'Published' : 'Draft'}
          </span>
          <button
            onClick={() => toggleStatus(row._id, row.published)}
            className={`px-2 py-1 text-xs rounded transition-colors whitespace-nowrap ${
              row.published
                ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            {row.published ? 'Unpublish' : 'Publish'}
          </button>
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
              onClick={() => window.open(`/updates/${row._id}`, '_blank')}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <Link
              to={`/admin/campus-updates/edit/${row._id}`}
              className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => handleDelete(row._id)}
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

  // Calculate stats
  const westlandsUpdates = updates.filter(u => u.campus === 'Westlands').length;
  const redhillUpdates = updates.filter(u => u.campus === 'Redhill').length;
  const publishedUpdates = updates.filter(u => u.published).length;
  const eventCount = updates.filter(u => u.type === 'Event').length;
  const announcementCount = updates.filter(u => u.type === 'Announcement').length;

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-light text-gray-900">Campus Updates</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage news, events, and announcements</p>
        </div>
        <Link
          to="/admin/campus-updates/create"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg 
                   hover:bg-red-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          Add Update
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
          <div className="text-lg sm:text-xl md:text-2xl font-light text-gray-900">{updates.length}</div>
          <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Total Updates
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
          <div className="text-lg sm:text-xl md:text-2xl font-light text-gray-900">{publishedUpdates}</div>
          <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Published
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
          <div className="text-lg sm:text-xl md:text-2xl font-light text-gray-900">{westlandsUpdates}</div>
          <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
            <Building className="w-3 h-3" />
            Westlands
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
          <div className="text-lg sm:text-xl md:text-2xl font-light text-gray-900">{redhillUpdates}</div>
          <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
            <Building className="w-3 h-3" />
            Redhill
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
          <div className="text-lg sm:text-xl md:text-2xl font-light text-gray-900">{eventCount}</div>
          <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Events
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

      {/* Filters */}
      <div className={`${showMobileFilters ? 'block' : 'hidden'} sm:block bg-white rounded-lg border border-gray-100 p-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Filter by:</span>
          </div>
          
          <div className="grid grid-cols-1 sm:flex sm:flex-row gap-3">
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {campuses.map(campus => (
                <option key={campus} value={campus}>
                  {campus === 'all' ? 'All Campuses' : campus}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setSelectedCampus('all');
                setSelectedType('all');
                setShowMobileFilters(false);
              }}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Data Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading updates...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={updates}
            searchable={true}
            searchPlaceholder="Search updates..."
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
            <p className="mt-4 text-gray-600">Loading updates...</p>
          </div>
        ) : updates.length > 0 ? (
          <div>
            {updates.map(update => (
              <UpdateCard key={update._id} update={update} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No updates found</h3>
            <p className="text-gray-600 mb-6">Create your first campus update to get started.</p>
            <Link
              to="/admin/campus-updates/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg 
                       hover:bg-red-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Update
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Load More */}
      {!loading && updates.length > 5 && (
        <div className="lg:hidden text-center">
          <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Load More Updates
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateList;