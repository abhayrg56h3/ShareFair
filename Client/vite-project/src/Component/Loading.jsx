import React from 'react';

const Loading = () => {
  return (
    <div className="loader-container">
      {/* Injecting styles directly here for single-file portability */}
      <style>{`
        .loader-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #0f172a; /* Slate 900 */
          background-image: 
            radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
            radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
            radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          overflow: hidden;
        }

        /* The 3D Structure */
        .loader-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
          perspective: 800px;
        }

        .ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 3px solid transparent;
        }

        /* Ring 1 - Cyan/Blue */
        .ring:nth-child(1) {
          border-top: 3px solid #06b6d4;
          border-right: 3px solid #06b6d4;
          animation: spin1 2s linear infinite;
          filter: drop-shadow(0 0 10px #06b6d4);
        }

        /* Ring 2 - Purple/Pink */
        .ring:nth-child(2) {
          border-bottom: 3px solid #a855f7;
          border-left: 3px solid #a855f7;
          animation: spin2 2.5s linear infinite;
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          filter: drop-shadow(0 0 10px #a855f7);
        }

        /* Ring 3 - Center Core */
        .ring:nth-child(3) {
          border: 2px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          width: 40%;
          height: 40%;
          top: 30%;
          left: 30%;
          backdrop-filter: blur(5px);
          animation: pulse 2s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
        }

        .loading-text {
          margin-top: 40px;
          font-size: 0.9rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6);
          animation: textFade 2s ease-in-out infinite;
        }

        /* Animations */
        @keyframes spin1 {
          0% { transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg); }
          100% { transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg); }
        }

        @keyframes spin2 {
          0% { transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg); }
          100% { transform: rotateX(50deg) rotateY(10deg) rotateZ(-360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 0.4; }
        }

        @keyframes textFade {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; text-shadow: 0 0 15px white; }
        }
      `}</style>

      <div className="loader-wrapper">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
      </div>
      
      <p className="loading-text">Initializing</p>
    </div>
  );
};

export default Loading;