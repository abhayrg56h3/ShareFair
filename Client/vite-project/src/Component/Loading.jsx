import React from 'react';

const Loading = () => {
  return (
    <div style={styles.container}>
      <div style={styles.loader}>
        <div style={styles.loaderInner}></div>
      </div>
      <p style={styles.text}>Loading...</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #f0f4f8 100%)',
  },
  loader: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1, #96f2d7, #ff6b6b)',
    position: 'relative',
    animation: 'spin 1.4s linear infinite',
    filter: 'drop-shadow(0 0 12px rgba(78, 205, 196, 0.2))',
  },
  loaderInner: {
    position: 'absolute',
    width: '60%',
    height: '60%',
    background: '#ffffff',
    borderRadius: '50%',
    top: '20%',
    left: '20%',
    animation: 'pulse 2s ease-in-out infinite',
    boxShadow: '0 0 16px rgba(255, 107, 107, 0.2)',
  },
  text: {
    marginTop: '24px',
    fontFamily: "'Segoe UI', sans-serif",
    fontWeight: '500',
    color: '#4a5568',
    fontSize: '1.1rem',
    letterSpacing: '0.5px',
  },
  // Animation styles
  '@keyframes spin': {
    to: {
      transform: 'rotate(360deg)',
    },
  },
  '@keyframes pulse': {
    '0%, 100%': {
      transform: 'scale(1)',
      opacity: '0.9',
    },
    '50%': {
      transform: 'scale(1.1)',
      opacity: '1',
    },
  },
};

// Add global styles
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.1);
      opacity: 1;
    }
  }
`, styleSheet.cssRules.length);

export default Loading;