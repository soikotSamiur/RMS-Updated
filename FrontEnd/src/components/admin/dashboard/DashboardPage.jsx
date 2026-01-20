import { useState, useEffect, useRef } from 'react';
import apiService from '../../../services/apiService';
import DashboardHeader from './DashboardHeader';
import StatsCards from './StatsCards';
import StatsCardsSkeleton from './StatsCardsSkeleton';
import RevenueChart from './RevenueChart';
import CategoryDistributionChart from './CategoryDistributionChart';
import ChartsSkeleton from './ChartsSkeleton';
import TopSellingProducts from './TopSellingProducts';
import ProductsSkeleton from './ProductsSkeleton';
import LowStockAlerts from './LowStockAlerts';
import AlertsSkeleton from './AlertsSkeleton';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [dailyTrends, setDailyTrends] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  
  const hasFetched = useRef(false);
  
  const fetchDashboardData = async () => {
    try {
      const statsRes = await apiService.dashboard.getDashboardStats();
      setStats(statsRes.data);
      setLoadingStats(false);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      const trendsRes = await apiService.dashboard.getDailyTrends();
      setDailyTrends(trendsRes.data);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      const categoryRes = await apiService.dashboard.getCategoryDistribution();
      setCategoryDistribution(categoryRes.data);
      setLoadingCharts(false);
      
   
      await new Promise(resolve => setTimeout(resolve, 100));
      const productsRes = await apiService.dashboard.getTopSellingProducts();
      setTopSellingProducts(productsRes.data || []);
      setLoadingProducts(false);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      const lowStockRes = await apiService.inventory.getLowStockItems();
      setLowStockItems(lowStockRes.data || []);
      setLoadingAlerts(false);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setLoadingStats(false);
      setLoadingCharts(false);
      setLoadingProducts(false);
      setLoadingAlerts(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchDashboardData();
    }
  }, []);

  const handleReorder = (itemId) => {
    const item = lowStockItems.find(i => i.id === itemId);
    if (item) {
      alert(`Reorder request sent for ${item.name} to ${item.supplier || 'supplier'}`);
    }
  };

  return (
    <div className="p-4 md:p-1">
      <DashboardHeader />
      
      {loadingStats ? <StatsCardsSkeleton /> : <StatsCards stats={stats} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {loadingCharts ? (
          <ChartsSkeleton />
        ) : (
          <>
            <RevenueChart dailyTrends={dailyTrends} />
            <CategoryDistributionChart categoryDistribution={categoryDistribution} />
          </>
        )}
      </div>

      {loadingProducts ? <ProductsSkeleton /> : <TopSellingProducts topSellingProducts={topSellingProducts} />}

      {loadingAlerts ? <AlertsSkeleton /> : <LowStockAlerts lowStockItems={lowStockItems} handleReorder={handleReorder} />}
    </div>
  );
};

export default DashboardPage;