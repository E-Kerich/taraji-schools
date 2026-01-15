import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { 
  Plus, 
  FileText, 
  Eye, 
  Calendar, 
  Filter, 
  TrendingUp, 
  Edit, 
  Trash2, 
  EyeOff,
  Users,
  BarChart3,
  CheckCircle,
  XCircle,
  Menu,
  ChevronDown,
  MoreVertical
} from 'lucide-react';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, [selectedStatus, selectedCampus]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      let url = '/blogs';
      
      if (selectedStatus !== 'all' || selectedCampus !== 'all') {
        const params = new URLSearchParams();
        if (selectedStatus !== 'all') params.append('status', selectedStatus);
        if (selectedCampus !== 'all') params.append('campus', selectedCampus);
        url += `?${params.toString()}`;
      }
      
      const res = await api.get(url);
      setBlogs(res.data.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      await api.delete(`/blogs/${id}`);
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      const res = await api.put(`/blogs/${id}`, { status: newStatus });
      setBlogs(prev =>
        prev.map(b => (b._id === id ? res.data.data : b))
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    if (status === 'published') {
      return (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
          <Eye className="w-3 h-3" />
          <span className="hidden sm:inline">Published</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
        <EyeOff className="w-3 h-3" />
        <span className="hidden sm:inline">Draft</span>
      </div>
    );
  };

  const getViewsDisplay = (views) => {
    if (!views) return '0';
    if (views < 1000) return views.toString();
    return `${(views / 1000).toFixed(1)}k`;
  };

  const toggleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Mobile Card View Component
  const BlogCard = ({ blog }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate mb-1">{blog.title}</h3>
          <div className="flex items-center gap-2">
            {getStatusBadge(blog.status)}
            <span className="text-xs text-gray-500">
              {formatFullDate(blog.createdAt)}
            </span>
          </div>
        </div>
        <button
          onClick={() => toggleRowExpand(blog._id)}
          className="ml-2 p-1 text-gray-400 hover:text-gray-600"
        >
          <ChevronDown className={`w-5 h-5 transform transition-transform ${expandedRow === blog._id ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Image Preview - Mobile */}
      {blog.featuredImage && (
        <div className="mb-3 rounded overflow-hidden">
          <img 
            src={blog.featuredImage} 
            alt={blog.title}
            className="w-full h-48 object-cover"
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
      )}

      {/* Campus & Author - Mobile */}
      <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-3 h-3" />
          <span>{blog.campus === 'all' ? 'All Campuses' : blog.campus}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>By {blog.author || 'Admin'}</span>
        </div>
      </div>

      {/* Views & Excerpt - Mobile */}
      <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
        {blog.views > 0 && (
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{getViewsDisplay(blog.views)} views</span>
          </div>
        )}
      </div>

      {blog.excerpt && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
      )}

      {/* Expanded Content */}
      {expandedRow === blog._id && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => toggleStatus(blog._id, blog.status)}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded transition-colors ${
                blog.status === 'published'
                  ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              {blog.status === 'published' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {blog.status === 'published' ? 'Unpublish' : 'Publish'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to={`/admin/blogs/edit/${blog._id}`}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={() => remove(blog._id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons - Collapsed */}
      {expandedRow !== blog._id && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
            <Link
              to={`/admin/blogs/edit/${blog._id}`}
              className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => remove(blog._id)}
              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => toggleStatus(blog._id, blog.status)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              blog.status === 'published'
                ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            {blog.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      )}
    </div>
  );

  const columns = [
    { 
      key: 'title', 
      label: 'Title',
      className: 'min-w-[200px]',
      render: (row) => (
        <div className="flex items-start gap-3">
          {row.featuredImage && (
            <div className="hidden md:block w-16 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-100">
              <img 
                src={row.featuredImage} 
                alt={row.title}
                className="w-full h-full object-cover"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 truncate">{row.title}</div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(row.createdAt)}
              </div>
              {row.views > 0 && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {getViewsDisplay(row.views)} views
                </div>
              )}
            </div>
            {row.excerpt && (
              <div className="hidden sm:block text-sm text-gray-600 truncate mt-1">{row.excerpt}</div>
            )}
          </div>
        </div>
      )
    },
    { 
      key: 'campus', 
      label: 'Campus',
      className: 'hidden lg:table-cell',
      render: (row) => (
        <div className="text-gray-700">
          {row.campus === 'all' ? 'All Campuses' : row.campus}
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      className: 'hidden md:table-cell',
      render: (row) => (
        <div className="flex flex-col gap-2">
          {getStatusBadge(row.status)}
          <button
            onClick={() => toggleStatus(row._id, row.status)}
            className={`px-2 py-1 text-xs rounded transition-colors whitespace-nowrap ${
              row.status === 'published'
                ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            {row.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      )
    },
    { 
      key: 'author', 
      label: 'Author',
      className: 'hidden xl:table-cell',
      render: (row) => (
        <div className="text-gray-600 text-sm">
          {row.author || 'Admin'}
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
              onClick={() => window.open(`/blog/${row.slug}`, '_blank')}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
            <Link
              to={`/admin/blogs/edit/${row._id}`}
              className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => remove(row._id)}
              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          {/* Mobile dropdown menu */}
          <div className="md:hidden relative">
            <button
              onClick={() => setExpandedRow(expandedRow === row._id ? null : row._id)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      )
    }
  ];

  const statuses = ['all', 'published', 'draft', 'scheduled'];
  const campuses = ['all', 'Westlands', 'Redhill'];

  // Calculate stats
  const publishedBlogs = blogs.filter(b => b.status === 'published').length;
  const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
  const averageViews = blogs.length > 0 ? Math.round(totalViews / blogs.length) : 0;

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-light text-gray-900">Blog Posts</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage and publish blog articles</p>
        </div>
        <Link
          to="/admin/blogs/create"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg 
                   hover:bg-red-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
          <div className="text-lg sm:text-xl md:text-2xl font-light text-gray-900">{blogs.length}</div>
          <div className="text-xs sm:text-sm text-gray-600">Total Posts</div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
          <div className="text-lg sm:text-xl md:text-2xl font-light text-gray-900">{publishedBlogs}</div>
          <div className="text-xs sm:text-sm text-gray-600">Published</div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
          <div className="text-lg sm:text-xl md:text-2xl font-light text-gray-900">{getViewsDisplay(totalViews)}</div>
          <div className="text-xs sm:text-sm text-gray-600">Total Views</div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
          <div className="text-lg sm:text-xl md:text-2xl font-light text-gray-900">
            {blogs.length > 0 ? Math.round((publishedBlogs / blogs.length) * 100) : 0}%
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Published Rate</div>
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
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

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

            <button
              onClick={() => {
                setSelectedStatus('all');
                setSelectedCampus('all');
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
            <p className="mt-4 text-gray-600">Loading blog posts...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={blogs}
            searchable={true}
            searchPlaceholder="Search blog posts..."
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
            <p className="mt-4 text-gray-600">Loading blog posts...</p>
          </div>
        ) : blogs.length > 0 ? (
          <div>
            {blogs.map(blog => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
            <p className="text-gray-600 mb-6">Create your first blog post to get started.</p>
            <Link
              to="/admin/blogs/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg 
                       hover:bg-red-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Post
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Load More (for mobile view) */}
      {!loading && blogs.length > 5 && (
        <div className="lg:hidden text-center">
          <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;