import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import CustomerLogin from './components/CustomerLogin';
import CustomerDashboard from './components/CustomerDashboard';
import Layout from './components/Layout';

const SUPABASE_URL = "https://urfpnpllldxyfkknvtto.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZnBucGxsbGR4eWZra252dHRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5ODQ1MTksImV4cCI6MjA2NTU2MDUxOX0.09Frqu3wmbWFDnMnrwnCvHsK4DKW4SADvGg89sDxPw0";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function App() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (name, uniqueId) => {
    try {
      setLoading(true);
      setError('');

      const { data, error: queryError } = await supabase
        .from('customers')
        .select('*')
        .eq('name', name)
        .eq('unique_id', uniqueId)
        .single();

      if (queryError) throw queryError;
      if (!data) throw new Error('مشتری با این مشخصات یافت نشد');

      // محاسبه موجودی اولیه
      const balance = await calculateCustomerBalance(data.id);
      setCustomer({ ...data, balance });
    } catch (err) {
      console.error('Login error:', err);
      setError('نام یا شناسه منحصر به فرد اشتباه است');
    } finally {
      setLoading(false);
    }
  };

  const calculateCustomerBalance = async (customerId) => {
    try {
      const { data: loans } = await supabase
        .from('loans')
        .select('amount')
        .eq('customer_id', customerId);

      const { data: receipts } = await supabase
        .from('receipts')
        .select('amount')
        .eq('customer_id', customerId);

      const loansTotal = loans?.reduce((sum, loan) => sum + parseFloat(loan.amount || 0), 0) || 0;
      const receiptsTotal = receipts?.reduce((sum, receipt) => sum + parseFloat(receipt.amount || 0), 0) || 0;
      
      return parseFloat((loansTotal - receiptsTotal).toFixed(2));
    } catch (error) {
      console.error('Error calculating balance:', error);
      return 0;
    }
  };

  const handleLogout = () => {
    setCustomer(null);
  };

  return (
    <Layout>
      {customer ? (
        <CustomerDashboard 
          customer={customer} 
          onLogout={handleLogout} 
          supabase={supabase}
        />
      ) : (
        <CustomerLogin 
          onLogin={handleLogin} 
          loading={loading} 
          error={error}
        />
      )}
    </Layout>
  );
}

export default App;