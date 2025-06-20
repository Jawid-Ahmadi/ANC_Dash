import { useState, useEffect } from 'react';
import { Table, Spinner } from 'react-bootstrap';

export default function CustomerLoans({ customerId, supabase }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('loans')
          .select('id, amount, description, created_at')
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setLoans(data || []);
      } catch (err) {
        console.error('Error fetching loans:', err);
        setError('خطا در دریافت وام‌ها');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [customerId, supabase]);

  if (loading) return (
    <div className="text-center py-4">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>مبلغ (افغانی)</th>
          <th>تاریخ</th>
          <th>توضیحات</th>
        </tr>
      </thead>
      <tbody>
        {loans.length > 0 ? (
          loans.map((loan, index) => (
            <tr key={loan.id}>
              <td>{index + 1}</td>
              <td>{parseFloat(loan.amount).toLocaleString('fa-IR')}</td>
              <td>{new Date(loan.created_at).toLocaleDateString('fa-IR')}</td>
              <td>{loan.description || '-'}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center">وام‌ای ثبت نشده است</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}