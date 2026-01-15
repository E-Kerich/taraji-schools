const StatCard = ({ title, value, subtitle, icon, trend, color = 'gray', loading = false }) => {
    // Color configurations
    const colors = {
      gray: {
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        value: 'text-gray-900',
        border: 'border-gray-200'
      },
      red: {
        bg: 'bg-red-50',
        text: 'text-red-600',
        value: 'text-red-700',
        border: 'border-red-100'
      },
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        value: 'text-blue-700',
        border: 'border-blue-100'
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        value: 'text-green-700',
        border: 'border-green-100'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        value: 'text-purple-700',
        border: 'border-purple-100'
      },
      yellow: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-600',
        value: 'text-yellow-700',
        border: 'border-yellow-100'
      }
    };
  
    const colorConfig = colors[color] || colors.gray;
  
    // Trend arrow indicator
    const renderTrend = () => {
      if (!trend) return null;
  
      const isPositive = trend.direction === 'up';
      const trendColor = isPositive ? 'text-green-600' : 'text-red-600';
      const arrow = isPositive ? '↑' : '↓';
  
      return (
        <span className={`text-sm font-medium ml-2 ${trendColor}`}>
          {arrow} {trend.value}%
        </span>
      );
    };
  
    if (loading) {
      return (
        <div className={`bg-white border ${colorConfig.border} rounded-xl p-6 animate-pulse`}>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      );
    }
  
    return (
      <div className={`bg-white border ${colorConfig.border} rounded-xl p-6 hover:shadow-md transition-shadow duration-300`}>
        {/* Header with Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className={`${colorConfig.text} text-sm font-medium uppercase tracking-wider`}>
            {title}
          </div>
          {icon && (
            <div className={`p-2 rounded-lg ${colorConfig.bg}`}>
              {icon}
            </div>
          )}
        </div>
  
        {/* Main Value */}
        <div className="flex items-baseline gap-2 mb-2">
          <div className={`text-3xl font-light ${colorConfig.value}`}>
            {value}
          </div>
          {renderTrend()}
        </div>
  
        {/* Subtitle */}
        {subtitle && (
          <div className="text-sm text-gray-500 mt-2">
            {subtitle}
          </div>
        )}
      </div>
    );
  };
  
  export default StatCard;