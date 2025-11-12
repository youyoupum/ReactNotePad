import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function NotFoundPage() {
  const location = useLocation();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h1 style={{ fontSize: '120px', margin: '0' }}>404</h1>
        <h2 style={{ fontSize: '32px', marginTop: '20px' }}>页面不存在</h2>
        <p style={{ fontSize: '18px', marginTop: '20px', opacity: 0.9 }}>
          抱歉，您访问的页面 <code style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            {location.pathname}
          </code> 不存在
        </p>
        <Link 
          to="/" 
          style={{
            display: 'inline-block',
            marginTop: '30px',
            padding: '14px 40px',
            background: 'white',
            color: '#667eea',
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          🏠 返回首页
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
