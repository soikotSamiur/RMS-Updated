import { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import DashboardHeader from './DashboardHeader';
import StatsCards from './StatsCards';
import RevenueChart from './RevenueChart';
import CategoryDistributionChart from './CategoryDistributionChart';
import TopSellingProducts from './TopSellingProducts';
import LowStockAlerts from './LowStockAlerts';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [dailyTrends, setDailyTrends] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, trendsRes, categoryRes, lowStockRes, topSellingRes] = await Promise.all([
        apiService.dashboard.getDashboardStats(),
        apiService.dashboard.getDailyTrends(),
        apiService.dashboard.getCategoryDistribution(),
        apiService.inventory.getLowStockItems(),
        apiService.dashboard.getTopSellingProducts()
      ]);
      
      setStats(statsRes.data);
      setDailyTrends(trendsRes.data);
      setCategoryDistribution(categoryRes.data);
      setLowStockItems(lowStockRes.data || []);
      setTopSellingProducts(topSellingRes.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (itemId) => {
    const item = lowStockItems.find(i => i.id === itemId);
    if (item) {
      alert(`Reorder request sent for ${item.name} to ${item.supplier || 'supplier'}`);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div className="p-4 md:p-1">
      <DashboardHeader />
      
      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RevenueChart dailyTrends={dailyTrends} />
        <CategoryDistributionChart categoryDistribution={categoryDistribution} />
      </div>

      <TopSellingProducts topSellingProducts={topSellingProducts} />

      <LowStockAlerts lowStockItems={lowStockItems} handleReorder={handleReorder} />
    </div>
  );
};

export default DashboardPage;