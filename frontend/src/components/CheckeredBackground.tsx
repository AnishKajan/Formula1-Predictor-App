import React from 'react';

const CheckeredBackground: React.FC = () => {
  const checkeredStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    backgroundImage: `
      linear-gradient(45deg, #000 25%, transparent 25%),
      linear-gradient(-45deg, #000 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #000 75%),
      linear-gradient(-45deg, transparent 75%, #000 75%)
    `,
    backgroundSize: '60px 60px',
    backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px',
    opacity: 0.1,
    animation: 'slideCheckered 20s linear infinite'
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, transparent, rgba(0,0,0,0.5), rgba(220,20,60,0.3))'
  };

  return (
    <>
      {/* Add keyframes animation to document head */}
      <style>{`
        @keyframes slideCheckered {
          0% { 
            background-position: 0 0, 0 30px, 30px -30px, -30px 0px; 
          }
          100% { 
            background-position: 60px 0, 60px 30px, 90px -30px, 30px 0px; 
          }
        }
      `}</style>
      
      <div style={checkeredStyle}>
        {/* Gradient overlay */}
        <div style={overlayStyle}></div>
      </div>
    </>
  );
};

export default CheckeredBackground;