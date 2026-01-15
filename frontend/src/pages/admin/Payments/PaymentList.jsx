import { useEffect, useState } from 'react';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  CreditCard, 
  Building, 
  Calendar, 
  Filter, 
  Download,
  CheckCircle,
  Clock,
  DollarSign,
  Receipt,
  ChevronDown,
  Smartphone,
  User,
  Phone,
  Mail,
  X
} from 'lucide-react';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Check screen size
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
    fetchPayments();
  }, [selectedMethod, selectedCampus]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      let url = '/payments';
      
      if (selectedMethod !== 'all' || selectedCampus !== 'all') {
        const params = new URLSearchParams();
        if (selectedMethod !== 'all') params.append('method', selectedMethod);
        if (selectedCampus !== 'all') params.append('campus', selectedCampus);
        url += `?${params.toString()}`;
      }
      
      const res = await api.get(url);
      setPayments(res.data.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
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
      ...(!isMobile && { year: 'numeric' })
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const isCompleted = status === 'completed';
    const isPending = status === 'pending';
    
    if (isCompleted) {
      return (
        <div className={`flex items-center gap-1 px-2 py-1 ${isMobile ? 'px-1.5 py-0.5' : ''} 
          bg-green-50 text-green-700 rounded text-xs border border-green-200`}>
          <CheckCircle className="w-3 h-3" />
          {!isMobile && "Completed"}
        </div>
      );
    }
    if (isPending) {
      return (
        <div className={`flex items-center gap-1 px-2 py-1 ${isMobile ? 'px-1.5 py-0.5' : ''} 
          bg-yellow-50 text-yellow-700 rounded text-xs border border-yellow-200`}>
          <Clock className="w-3 h-3" />
          {!isMobile && "Pending"}
        </div>
      );
    }
    return (
      <div className={`flex items-center gap-1 px-2 py-1 ${isMobile ? 'px-1.5 py-0.5' : ''} 
        bg-red-50 text-red-700 rounded text-xs border border-red-200`}>
        <Clock className="w-3 h-3" />
        {!isMobile && "Failed"}
      </div>
    );
  };

  const getMethodIcon = (method) => {
    switch(method) {
      case 'mpesa': return 'MPESA';
      case 'bank_transfer': return 'Bank';
      case 'card': return 'Card';
      case 'cash': return 'Cash';
      default: return method;
    }
  };

  const getMethodIconComponent = (method) => {
    switch(method) {
      case 'mpesa': 
        return <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center text-white text-xs">M</div>;
      case 'bank_transfer': 
        return <Building className="w-5 h-5 text-blue-500" />;
      case 'card': 
        return <CreditCard className="w-5 h-5 text-purple-500" />;
      case 'cash': 
        return <DollarSign className="w-5 h-5 text-green-500" />;
      default: 
        return <DollarSign className="w-5 h-5 text-gray-500" />;
    }
  };

  // Responsive columns configuration
  const getColumns = () => {
    if (isMobile) {
      return [
        {
          key: 'mobileCard',
          label: '',
          render: (row) => (
            <div 
              className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
              onClick={() => setSelectedPayment(row)}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 truncate">{row.parentName}</div>
                  <div className="text-xs text-gray-500 truncate">{row.studentName || 'No student'}</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-medium text-gray-900">{formatAmount(row.amount)}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{formatDate(row.createdAt)}</div>
                </div>
              </div>

              {/* Card Details */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getMethodIconComponent(row.method)}
                  <span className="text-xs text-gray-600">{getMethodIcon(row.method)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Building className="w-3 h-3" />
                    {row.campus}
                  </div>
                  {getStatusBadge(row.status || 'completed')}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-gray-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('View receipt:', row);
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                  title="Receipt"
                >
                  <Receipt className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Download:', row);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 rounded"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        }
      ];
    }

    if (isTablet) {
      return [
        { 
          key: 'parentName', 
          label: 'Parent',
          width: '25%',
          render: (row) => (
            <div className="min-w-0">
              <div className="font-medium text-gray-900 truncate">{row.parentName}</div>
              <div className="text-sm text-gray-500 truncate">{row.studentName || 'No student'}</div>
            </div>
          )
        },
        { 
          key: 'amount', 
          label: 'Amount',
          width: '20%',
          render: (row) => (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <div>
                <div className="font-medium text-gray-900">{formatAmount(row.amount)}</div>
                <div className="text-xs text-gray-500 truncate">{row.purpose}</div>
              </div>
            </div>
          )
        },
        { 
          key: 'method', 
          label: 'Method',
          width: '15%',
          render: (row) => (
            <div className="flex items-center gap-2">
              {getMethodIconComponent(row.method)}
              <span className="text-sm text-gray-700">{getMethodIcon(row.method)}</span>
            </div>
          )
        },
        {
          key: 'status',
          label: 'Status',
          width: '15%',
          render: (row) => getStatusBadge(row.status || 'completed')
        },
        {
          key: 'actions',
          label: '',
          width: '25%',
          render: (row) => (
            <div className="flex items-center justify-end gap-1">
              <div className="text-xs text-gray-500 mr-2">{formatDate(row.createdAt)}</div>
              <button
                onClick={() => console.log('View payment:', row)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                title="Receipt"
              >
                <Receipt className="w-4 h-4" />
              </button>
              <button
                onClick={() => console.log('Download receipt for:', row)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          )
        }
      ];
    }

    // Desktop view
    return [
      { 
        key: 'parentName', 
        label: 'Parent',
        render: (row) => (
          <div>
            <div className="font-medium text-gray-900">{row.parentName}</div>
            <div className="text-sm text-gray-500">{row.studentName || 'No student specified'}</div>
          </div>
        )
      },
      { 
        key: 'campus', 
        label: 'Campus',
        render: (row) => (
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">{row.campus}</span>
          </div>
        )
      },
      { 
        key: 'amount', 
        label: 'Amount',
        render: (row) => (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <div>
              <div className="font-medium text-gray-900">{formatAmount(row.amount)}</div>
              <div className="text-xs text-gray-500">{row.purpose}</div>
            </div>
          </div>
        )
      },
      { 
        key: 'method', 
        label: 'Method',
        render: (row) => (
          <div className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded text-sm">
            {getMethodIcon(row.method)}
          </div>
        )
      },
      { 
        key: 'date', 
        label: 'Date',
        render: (row) => (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            {formatDate(row.createdAt)}
          </div>
        )
      },
      {
        key: 'status',
        label: 'Status',
        render: (row) => getStatusBadge(row.status || 'completed')
      },
      {
        key: 'actions',
        label: '',
        render: (row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => console.log('View payment:', row)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="View Receipt"
            >
              <Receipt className="w-4 h-4" />
            </button>
            <button
              onClick={() => console.log('Download receipt for:', row)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        )
      }
    ];
  };

  const methods = ['all', 'mpesa', 'bank_transfer', 'card', 'cash'];
  const campuses = ['all', 'Westlands', 'Redhill'];

  // Calculate totals
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthPayments = payments.filter(p => {
    const date = new Date(p.createdAt);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  });
  const thisMonthAmount = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0);

  // Payment Detail Modal for Mobile
  const PaymentDetailModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Payment Details</h3>
          <button
            onClick={() => setSelectedPayment(null)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {selectedPayment && (
          <div className="p-4 space-y-4">
            {/* Parent & Student Info */}
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Parent</div>
                <div className="font-medium text-gray-900">{selectedPayment.parentName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Student</div>
                <div className="font-medium text-gray-900">{selectedPayment.studentName || 'Not specified'}</div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="text-xl font-bold text-gray-900">{formatAmount(selectedPayment.amount)}</div>
                </div>
                {getStatusBadge(selectedPayment.status || 'completed')}
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                <div>
                  <div className="text-sm text-gray-500">Method</div>
                  <div className="font-medium text-gray-900">{getMethodIcon(selectedPayment.method)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Campus</div>
                  <div className="font-medium text-gray-900">{selectedPayment.campus}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Purpose</div>
                <div className="font-medium text-gray-900">{selectedPayment.purpose}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Date</div>
                <div className="font-medium text-gray-900">{formatDate(selectedPayment.createdAt)}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  console.log('View receipt:', selectedPayment);
                  setSelectedPayment(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Receipt className="w-4 h-4" />
                View Receipt
              </button>
              <button
                onClick={() => {
                  console.log('Download:', selectedPayment);
                  setSelectedPayment(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Payments</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Manage and track all school payments</p>
        </div>
        <Link
          to="/admin/payments/create"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg 
                   hover:bg-red-700 transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span className="whitespace-nowrap">Record Payment</span>
        </Link>
      </div>

      {/* Stats Summary - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-100">
          <div className="text-lg md:text-2xl font-light text-gray-900 truncate">{formatAmount(totalAmount)}</div>
          <div className="text-xs md:text-sm text-gray-600">Total Revenue</div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-100">
          <div className="text-lg md:text-2xl font-light text-gray-900 truncate">{formatAmount(thisMonthAmount)}</div>
          <div className="text-xs md:text-sm text-gray-600">This Month</div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-100">
          <div className="text-lg md:text-2xl font-light text-gray-900">{payments.length}</div>
          <div className="text-xs md:text-sm text-gray-600">Transactions</div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-100">
          <div className="text-lg md:text-2xl font-light text-gray-900">{thisMonthPayments.length}</div>
          <div className="text-xs md:text-sm text-gray-600">This Month</div>
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
              {(selectedMethod !== 'all' || selectedCampus !== 'all') && (
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
                <label className="text-sm font-medium text-gray-700">Payment Method</label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                >
                  {methods.map(method => (
                    <option key={method} value={method}>
                      {method === 'all' ? 'All Methods' : method.replace('_', ' ')}
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
                    setSelectedMethod('all');
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
                  Apply
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
            <span className="text-sm text-gray-600 hidden sm:inline">Filter by:</span>
          </div>
          
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 min-w-[140px]"
          >
            {methods.map(method => (
              <option key={method} value={method}>
                {method === 'all' ? 'All Methods' : method.replace('_', ' ')}
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
              setSelectedMethod('all');
              setSelectedCampus('all');
            }}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 md:p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-4 border-red-600 border-t-transparent"></div>
            <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-600">Loading payments...</p>
          </div>
        ) : (
          <>
            {isMobile ? (
              // Mobile card view
              <div className="divide-y divide-gray-100">
                {payments.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-gray-400 mb-2">No payments found</div>
                    <p className="text-sm text-gray-500">Try adjusting your filters</p>
                  </div>
                ) : (
                  payments.map((payment) => (
                    <div key={payment._id}>
                      {getColumns()[0].render(payment)}
                    </div>
                  ))
                )}
              </div>
            ) : (
              // Desktop/Tablet table view
              <DataTable
                columns={getColumns()}
                data={payments}
                searchable={true}
                selectable={!isMobile && !isTablet}
                responsive={true}
              />
            )}
          </>
        )}
      </div>

      {/* Export Options */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          Showing {payments.length} payments
        </div>
        
        {isMobile ? (
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Export Data
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showExportOptions && (
              <div className="absolute bottom-full mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100">
                  Export as CSV
                </button>
                <button className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100">
                  Export as Excel
                </button>
                <button className="w-full px-4 py-3 text-left hover:bg-gray-50">
                  Export as PDF
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors">
            <Download className="w-4 h-4" />
            Export as CSV
          </button>
        )}
      </div>

      {/* Mobile Bottom Action Bar */}
      {isMobile && payments.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center justify-between shadow-lg lg:hidden">
          <div className="text-sm text-gray-600">
            {formatAmount(totalAmount)} total
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchPayments}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowExportOptions(true)}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
            >
              Export
            </button>
          </div>
        </div>
      )}

      {/* Payment Detail Modal for Mobile */}
      {selectedPayment && <PaymentDetailModal />}
    </div>
  );
};

export default PaymentList;