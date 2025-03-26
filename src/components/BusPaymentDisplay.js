import React, { useState, useEffect } from 'react';
import './BusPaymentDisplay.css';

const BusPaymentDisplay = () => {
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [isCardDetected, setIsCardDetected] = useState(false);
  const [lastPaymentTime, setLastPaymentTime] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState('');

  useEffect(() => {
    const updateTime = () => {
      if (lastPaymentTime) {
        const now = new Date();
        const diff = now - lastPaymentTime;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeDisplay(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    // Actualizar inmediatamente
    updateTime();

    // Configurar el intervalo para actualizar cada segundo
    const interval = setInterval(updateTime, 1000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [lastPaymentTime]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });

    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  const prices = {
    regular: 3000,
    senior: 2500,
    student: 2500
  };

  const getPaymentStatusColor = () => {
    switch (paymentStatus) {
      case 'paid':
        return 'payment-status-paid';
      case 'insufficient':
        return 'payment-status-insufficient';
      case 'error':
        return 'payment-status-error';
      default:
        return 'payment-status-pending';
    }
  };

  const getPaymentStatusText = () => {
    switch (paymentStatus) {
      case 'paid':
        return 'PAGADO';
      case 'insufficient':
        return 'SALDO INSUFICIENTE';
      case 'error':
        return 'ERROR DE PAGO';
      default:
        return 'PAGUE SU PASAJE';
    }
  };

  const handleCardDetection = () => {
    setIsCardDetected(true);
    // Simular proceso de pago
    setTimeout(() => {
      const randomStatus = ['paid', 'insufficient', 'error'][Math.floor(Math.random() * 3)];
      // const randomStatus = ['paid', 'paid', 'paid'][Math.floor(Math.random() * 3)];
      setPaymentStatus(randomStatus);
      
      // Si el pago fue exitoso, incrementar el contador
      if (randomStatus === 'paid') {
        incrementPassengerCount();
      }

      setTimeout(() => {
        setPaymentStatus('pending');
        setIsCardDetected(false);
      }, 3000);
    }, 1000);
  };

  const incrementPassengerCount = () => {
    setTotalPassengers(prev => prev + 1);
    setLastPaymentTime(new Date());
  };

  return (
    <div className="bus-payment-container">
      <div 
        className="background-overlay"
        style={{
          backgroundImage: `url('/fondo_sg_tech.jpg')`
        }}
      />
      <div className="content-wrapper">
        <div className="display-header">
          <div className="logo-container">
            <img 
              src="/logo-sg-tech-1x.png" 
              alt="Logo" 
              className="logo-image"
            />
          </div>
          <div className="passenger-count">
            <div className="count-label">TOTAL PASAJEROS:</div>
            <div className="count-number">{totalPassengers}</div>
            {lastPaymentTime && (
              <div className="last-payment-time">
                Último pago: {timeDisplay}
              </div>
            )}
          </div>
          {isInstallable && (
            <button className="pwa-download-btn" onClick={handleInstallClick}>
              <span className="download-icon">⬇️</span>
              <span className="download-text">Instalar App</span>
            </button>
          )}
        </div>

        <div className={`payment-status ${getPaymentStatusColor()}`}>
          {getPaymentStatusText()}
        </div>

        <div className="prices-section">
          <h2>TARIFAS:</h2>
          <div className="price-item">
            <span>PASAJE 2025:</span>
            <span>${prices.regular}</span>
          </div>
          <div className="price-item">
            <span>ADULTO MAYOR:</span>
            <span>${prices.senior}</span>
          </div>
          <div className="price-item">
            <span>ESTUDIANTE:</span>
            <span>${prices.student}</span>
          </div>
        </div>

        <div className="card-reader-section">
          <div className="card-reader-text">
            {isCardDetected ? 'PROCESANDO...' : 'ACERCA TU TARJETA AQUÍ'}
          </div>
          <div 
            className={`card-reader-visual ${isCardDetected ? 'card-reader-active' : ''}`}
            onClick={handleCardDetection}
          >
            <div className="card-reader-top"></div>
            <div className="card-reader-middle"></div>
            <div className="card-reader-bottom"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusPaymentDisplay; 