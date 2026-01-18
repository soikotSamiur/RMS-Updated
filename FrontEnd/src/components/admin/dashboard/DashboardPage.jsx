import { useState, useEffect, useCallback } from 'react';
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
  
  const fetchDashboardData = useCallback(async () => {
        
    apiService.dashboard.getDashboardStats()
      .then(res => {
        setStats(res.data);
        setLoadingStats(false);
      })
      .catch(err => {
        console.error('Failed to fetch stats:', err);
        setLoadingStats(false);
      });
    
    Promise.all([
      apiService.dashboard.getDailyTrends(),
      apiService.dashboard.getCategoryDistribution()
    ])
      .then(([trendsRes, categoryRes]) => {
        setDailyTrends(trendsRes.data);
        setCategoryDistribution(categoryRes.data);
        setLoadingCharts(false);
      })
      .catch(err => {
        console.error('Failed to fetch charts:', err);
        setLoadingCharts(false);
      });
    
    apiService.dashboard.getTopSellingProducts()
      .then(res => {
        setTopSellingProducts(res.data || []);
        setLoadingProducts(false);
      })
      .catch(err => {
        console.error('Failed to fetch top products:', err);
        setLoadingProducts(false);
      });
    
    apiService.inventory.getLowStockItems()
      .then(res => {
        setLowStockItems(res.data || []);
        setLoadingAlerts(false);
      })
      .catch(err => {
        console.error('Failed to fetch low stock items:', err);
        setLoadingAlerts(false);
      });
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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