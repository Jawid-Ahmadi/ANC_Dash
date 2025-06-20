import { useState, useEffect } from 'react';
import { Tab, Nav, Card, Button } from 'react-bootstrap';
import CustomerLoans from './CustomerLoans';
import CustomerReceipts from './CustomerReceipts';

export default function CustomerDashboard({ customer, onLogout, supabase }) {
  const [activeTab, setActiveTab] = useState('loans');
  const [balance, setBalance] = useState(customer.balance || 0);
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      setLoadingBalance(true);
      try {
        const { data: loans } = await supabase
          .from('loans')
          .select('amount')
          .eq('customer_id', customer.id);

        const { data: receipts } = await supabase
          .from('receipts')
          .select('amount')
          .eq('customer_id', customer.id);

        const loansTotal = loans?.reduce((sum, loan) => sum + parseFloat(loan.amount || 0), 0) || 0;
        const receiptsTotal = receipts?.reduce((sum, receipt) => sum + parseFloat(receipt.amount || 0), 0) || 0;
        
        const currentBalance = parseFloat((loansTotal - receiptsTotal).toFixed(2));
        setBalance(currentBalance);
      } catch (error) {
        console.error('Error calculating balance:', error);
        setBalance(0);
      } finally {
        setLoadingBalance(false);
      }
    };

    fetchBalance();
  }, [customer.id, supabase]);

  const formatBalance = (balance) => {
    const absBalance = Math.abs(balance);
    const formatted = absBalance.toLocaleString('fa-IR');
    
    if (balance > 0) return `${formatted} (بدهکار)`;
    if (balance < 0) return `${formatted} (بستانکار)`;
    return 'صفر';
  };

  const getBalanceClass = () => {
    if (balance > 0) return 'text-danger';
    if (balance < 0) return 'text-success';
    return 'text-muted';
  };

  return (
    <div className="mt-4">
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">داشبورد مشتری</h4>
          <Button variant="outline-danger" onClick={onLogout}>
            خروج
          </Button>
        </Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-md-6">
              <h5>{customer.name}</h5>
              <p className="text-muted">شناسه: {customer.unique_id}</p>
              {customer.phone && <p className="text-muted">تلفن: {customer.phone}</p>}
            </div>
            <div className="col-md-6 text-end">
              <h5 className={getBalanceClass()}>
                موجودی: {loadingBalance ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : (
                  formatBalance(balance)
                )}
              </h5>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="loans">بردگی</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="receipts">رسیدها</Nav.Link>
          </Nav.Item>
        </Nav>
        
        <Tab.Content>
          <Tab.Pane eventKey="loans">
            <CustomerLoans customerId={customer.id} supabase={supabase} />
          </Tab.Pane>
          <Tab.Pane eventKey="receipts">
            <CustomerReceipts customerId={customer.id} supabase={supabase} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}