import { useState, useEffect } from 'react';
import { Table, Spinner } from 'react-bootstrap';

export default function CustomerReceipts({ customerId, supabase }) {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('receipts')
          .select('id, amount, description, created_at')
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setReceipts(data || []);
      } catch (err) {
        console.error('Error fetching receipts:', err);
        setError('خطا در دریافت رسیدها');
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
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
        {receipts.length > 0 ? (
          receipts.map((receipt, index) => (
            <tr key={receipt.id}>
              <td>{index + 1}</td>
              <td>{parseFloat(receipt.amount).toLocaleString('fa-IR')}</td>
              <td>{new Date(receipt.created_at).toLocaleDateString('fa-IR')}</td>
              <td>{receipt.description || '-'}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center">رسیدی ثبت نشده است</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}