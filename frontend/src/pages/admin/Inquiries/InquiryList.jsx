import { useEffect, useState } from 'react';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { 
  Mail, Phone, Calendar, User, Building, 
  Filter, Eye, MessageSquare, ChevronDown,
  Smartphone, Tablet, Monitor
} from 'lucide-react';

const InquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [selectedStatus, selectedCampus]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      let url = '/inquiries';
      
      if (selectedStatus !== 'all' || selectedCampus !== 'all') {
        const params = new URLSearchParams();
        if (selectedStatus !== 'all') params.append('status', selectedStatus);
        if (selectedCampus !== 'all') params.append('campus', selectedCampus);
        url += `?${params.toString()}`;
      }
      
      const res = await api.get(url);
      setInquiries(res.data.data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/inquiries/${id}`, { status });
      setInquiries(prev =>
        prev.map(i => (i._id === id ? res.data.data : i))
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // For mobile: show relative time for recent dates
    if (isMobile && diffDays < 7) {
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
    }

    return date.toLocaleDateString('en-US', {
      month: isMobile ? 'numeric' : 'short',
      day: 'numeric',
      ...(!isMobile && { hour: '2-digit', minute: '2-digit' })
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'follow_up': return 'bg-purple-100 text-purple-800';
      case 'enrolled': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Responsive columns configuration
  const getColumns = () => {
    if (isMobile) {
      // Mobile view - compact cards
      return [
        {
          key: 'mobileCard',
          label: '',
          render: (row) => (
            <div className="p-3 border-b border-gray-100 last:border-b-0">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm truncate max-w-[150px]">
                      {row.parentName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {row.studentName || 'No student name'}
                    </div>
                  </div>
                </div>
                <select
                  value={row.status}
                  onChange={(e) => updateStatus(row._id, e.target.value)}
                  className="text-xs px-2 py-1 rounded border border-gray-200 bg-gray-50 focus:outline-none"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="enrolled">Enrolled</option>
                </select>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-600 truncate">{row.email}</span>
                </div>
                {row.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{row.phone}</span>
                  </div>
                )}
              </div>

              {/* Details & Actions */}
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Building className="w-3 h-3" />
                    {row.campus || 'No campus'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(row.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => window.open(`mailto:${row.email}`)}
                    className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  {row.phone && (
                    <button
                      onClick={() => window.open(`tel:${row.phone}`)}
                      className="p-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        }
      ];
    }

    // Tablet view (768px - 1024px)
    if (isTablet) {
      return [
        { 
          key: 'parentName', 
          label: 'Parent',
          width: '30%',
          render: (row) => (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="font-medium text-gray-900 truncate">{row.parentName}</div>
                <div className="text-sm text-gray-500 truncate">{row.studentName || 'No student name'}</div>
              </div>
            </div>
          )
        },
        { 
          key: 'contact', 
          label: 'Contact',
          width: '25%',
          render: (row) => (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-gray-400" />
                <span className="text-sm truncate">{row.email}</span>
              </div>
              {row.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <span className="text-sm truncate">{row.phone}</span>
                </div>
              )}
            </div>
          )
        },
        { 
          key: 'status', 
          label: 'Status',
          width: '20%',
          render: (row) => (
            <select
              value={row.status}
              onChange={(e) => updateStatus(row._id, e.target.value)}
              className={`px-2 py-1 text-sm rounded border focus:outline-none w-full max-w-[150px] ${
                row.status === 'new' ? 'border-blue-200 bg-blue-50' :
                row.status === 'contacted' ? 'border-yellow-200 bg-yellow-50' :
                row.status === 'follow_up' ? 'border-purple-200 bg-purple-50' :
                'border-gray-200 bg-gray-50'
              }`}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="follow_up">Follow-up</option>
              <option value="enrolled">Enrolled</option>
            </select>
          )
        },
        {
          key: 'actions',
          label: '',
          width: '25%',
          render: (row) => (
            <div className="flex items-center justify-end gap-1">
              <button
                onClick={() => window.open(`mailto:${row.email}`)}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </button>
              {row.phone && (
                <button
                  onClick={() => window.open(`tel:${row.phone}`)}
                  className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                  title="Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
              )}
              <div className="text-xs text-gray-500 ml-2">
                {formatDate(row.createdAt)}
              </div>
            </div>
          )
        }
      ];
    }

    // Desktop view (1024px+)
    return [
      { 
        key: 'parentName', 
        label: 'Parent',
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{row.parentName}</div>
              <div className="text-sm text-gray-500">{row.studentName || 'Student name not provided'}</div>
            </div>
          </div>
        )
      },
      { 
        key: 'contact', 
        label: 'Contact',
        render: (row) => (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-3 h-3" />
              <span className="text-sm truncate">{row.email}</span>
            </div>
            {row.phone && (
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-3 h-3" />
                <span className="text-sm">{row.phone}</span>
              </div>
            )}
          </div>
        )
      },
      { 
        key: 'details', 
        label: 'Details',
        render: (row) => (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Building className="w-3 h-3 text-gray-400" />
              <span className="text-sm text-gray-700">{row.campus || 'Not specified'}</span>
            </div>
            <div className="text-sm text-gray-500">
              Year {row.yearApplying || 'N/A'}
            </div>
          </div>
        )
      },
      { 
        key: 'date', 
        label: 'Date',
        render: (row) => (
          <div className="text-sm text-gray-600">
            {formatDate(row.createdAt)}
          </div>
        )
      },
      {
        key: 'status',
        label: 'Status',
        render: (row) => (
          <select
            value={row.status}
            onChange={(e) => updateStatus(row._id, e.target.value)}
            className={`px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:border-gray-400 ${
              row.status === 'new' ? 'border-blue-200 bg-blue-50' :
              row.status === 'contacted' ? 'border-yellow-200 bg-yellow-50' :
              row.status === 'follow_up' ? 'border-purple-200 bg-purple-50' :
              'border-gray-200 bg-gray-50'
            }`}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="follow_up">Follow-up</option>
            <option value="enrolled">Enrolled</option>
            <option value="not_interested">Not Interested</option>
          </select>
        )
      },
      {
        key: 'actions',
        label: '',
        render: (row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(`mailto:${row.email}?subject=Re: Your Brookside Inquiry`)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Send Email"
            >
              <Mail className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.open(`tel:${row.phone}`)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                // View details action
                console.log('View inquiry:', row);
              }}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        )
      }
    ];
  };

  const statuses = ['all', 'new', 'contacted', 'follow_up', 'enrolled', 'not_interested'];
  const campuses = ['all', 'Westlands', 'Redhill'];

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-4 lg:p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-light text-gray-900">Admission Inquiries</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Manage and track parent inquiries</p>
      </div>

      {/* Stats Summary - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-100">
          <div className="text-lg md:text-2xl font-light text-gray-900">{inquiries.length}</div>
          <div className="text-xs md:text-sm text-gray-600">Total Inquiries</div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-100">
          <div className="text-lg md:text-2xl font-light text-gray-900">
            {inquiries.filter(i => i.status === 'new').length}
          </div>
          <div className="text-xs md:text-sm text-gray-600">New</div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-100">
          <div className="text-lg md:text-2xl font-light text-gray-900">
            {inquiries.filter(i => i.status === 'contacted').length}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Contacted</div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-100">
          <div className="text-lg md:text-2xl font-light text-gray-900">
            {inquiries.filter(i => i.status === 'enrolled').length}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Enrolled</div>
        </div>
      </div>

      {/* Filters - Responsive */}
      {isMobile ? (
        <>
          {/* Mobile filter button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Filters</span>
              {(selectedStatus !== 'all' || selectedCampus !== 'all') && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Mobile filter dropdown */}
          {showMobileFilters && (
            <div className="bg-white rounded-lg border border-gray-100 p-4 space-y-4 animate-in slide-in-from-top">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Statuses' : status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Campus</label>
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                >
                  {campuses.map(campus => (
                    <option key={campus} value={campus}>
                      {campus === 'all' ? 'Both Campuses' : campus}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedStatus('all');
                    setSelectedCampus('all');
                    setShowMobileFilters(false);
                  }}
                  className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 px-3 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Desktop/Tablet Filters */
        <div className="flex flex-wrap items-center gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-lg border border-gray-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 hidden sm:inline">Filter:</span>
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 min-w-[140px]"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status.replace('_', ' ')}
              </option>
            ))}
          </select>

          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 min-w-[140px]"
          >
            {campuses.map(campus => (
              <option key={campus} value={campus}>
                {campus === 'all' ? 'Both Campuses' : campus}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSelectedStatus('all');
              setSelectedCampus('all');
            }}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap"
          >
            Clear Filters
          </button>

          {/* Screen size indicator (for debugging) - remove in production */}
          <div className="hidden lg:flex items-center gap-1 ml-auto text-xs text-gray-400">
            {isTablet ? (
              <>
                <Tablet className="w-3 h-3" />
                <span>Tablet View</span>
              </>
            ) : (
              <>
                <Monitor className="w-3 h-3" />
                <span>Desktop View</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 md:p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-4 border-red-600 border-t-transparent"></div>
            <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-600">Loading inquiries...</p>
          </div>
        ) : (
          <>
            {isMobile ? (
              // Mobile card view
              <div className="divide-y divide-gray-100">
                {inquiries.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No inquiries found
                  </div>
                ) : (
                  inquiries.map((inquiry) => (
                    <div key={inquiry._id}>
                      {getColumns()[0].render(inquiry)}
                    </div>
                  ))
                )}
              </div>
            ) : (
              // Desktop/Tablet table view
              <DataTable
                columns={getColumns()}
                data={inquiries}
                searchable={true}
                selectable={!isMobile && !isTablet}
                responsive={true}
              />
            )}
          </>
        )}
      </div>

      {/* Mobile bottom action bar */}
      {isMobile && inquiries.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center justify-between shadow-lg lg:hidden">
          <div className="text-sm text-gray-600">
            {inquiries.length} inquiries
          </div>
          <button
            onClick={fetchInquiries}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default InquiryList;