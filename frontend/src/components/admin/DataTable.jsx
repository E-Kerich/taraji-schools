import { useState } from 'react';
import { ChevronUp, ChevronDown, Search, Filter, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';

const DataTable = ({ columns, data, searchable = false, selectable = false, actions = [] }) => {
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter data based on search
  const filteredData = searchable 
    ? data.filter(row => 
        columns.some(col => {
          const value = col.render ? col.render(row).toString() : row[col.key]?.toString();
          return value?.toLowerCase().includes(search.toLowerCase());
        })
      )
    : data;

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort
  const handleSort = (key) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  // Handle row selection
  const toggleRowSelection = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = new Set(paginatedData.map(row => row._id));
      setSelectedRows(allIds);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
      {/* Header with Search and Actions */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            {searchable && (
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg 
                           focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {selectedRows.size > 0 && (
              <div className="text-sm text-gray-600">
                {selectedRows.size} selected
              </div>
            )}
            {selectable && selectedRows.size > 0 && (
              <button className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                Delete Selected
              </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 
                              hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {selectable && (
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  className="text-left p-4 font-medium text-gray-700 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable !== false && (
                      <div className="flex flex-col">
                        <ChevronUp className={`w-3 h-3 -mb-1 ${sortColumn === col.key && sortDirection === 'asc' ? 'text-gray-900' : 'text-gray-400'}`} />
                        <ChevronDown className={`w-3 h-3 ${sortColumn === col.key && sortDirection === 'desc' ? 'text-gray-900' : 'text-gray-400'}`} />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="w-20 p-4 text-right font-medium text-gray-700 text-sm">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map(row => (
                <tr
                  key={row._id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedRows.has(row._id) ? 'bg-red-50' : ''
                  }`}
                >
                  {selectable && (
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row._id)}
                        onChange={() => toggleRowSelection(row._id)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={col.key} className="p-4 text-gray-700 text-sm">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {actions.includes('view') && (
                          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {actions.includes('edit') && (
                          <button className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {actions.includes('delete') && (
                          <button className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className="p-8 text-center text-gray-500"
                >
                  {search ? 'No results found' : 'No data available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center text-sm rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? 'bg-red-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;