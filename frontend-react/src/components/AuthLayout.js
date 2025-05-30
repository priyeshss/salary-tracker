import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5',
      padding: '20px',
    }}>
      <div style={{
        background: '#fff',
        padding: '40px 30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
      }}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
