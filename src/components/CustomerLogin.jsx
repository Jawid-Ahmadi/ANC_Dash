import { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

export default function CustomerLogin({ onLogin, loading, error }) {
  const [name, setName] = useState('');
  const [uniqueId, setUniqueId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(name.trim(), uniqueId.trim());
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0 text-white">ورود مشتریان</h4>
          </div>
          <div className="card-body">
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>نام کامل</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="نام خود را وارد کنید"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>شناسه منحصر به فرد</Form.Label>
                <Form.Control
                  type="text"
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value)}
                  required
                  placeholder="شناسه خود را وارد کنید"
                />
              </Form.Group>
              
              <Button 
                type="submit" 
                variant="primary" 
                className="w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="me-2">در حال ورود...</span>
                  </>
                ) : 'ورود'}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}