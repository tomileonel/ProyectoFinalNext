'use client'

import { ChevronLeft, Check } from 'lucide-react'
import styles from './styles.module.css'

const Pedido = () => {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles['back-button']}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Recibo de la orden</h1>
      </div>

      {/* Success Message */}
      <div className={styles['success-section']}>
        <div className={styles['success-icon']}>
          <Check size={32} color="white" />
        </div>
        <h2 className={styles['success-title']}>Gracias!</h2>
        <p className={styles['success-message']}>Tu transacción fue exitosa</p>
      </div>

      {/* Order Details */}
      <div className={styles['order-details']}>
        <div className={styles['detail-row']}>
          <span className={styles['detail-label']}>Id de la transacción</span>
          <span className={styles['detail-value']}>D123456789ABC</span>
        </div>
        
        <div className={styles['detail-row']}>
          <span className={styles['detail-label']}>Fecha</span>
          <span className={styles['detail-value']}>10 de julio 2021</span>
        </div>

        <div className={styles['detail-row']}>
          <span className={styles['detail-label']}>Hora</span>
          <span className={styles['detail-value']}>04:13 PM</span>
        </div>

        <div className={styles['detail-section']}>
          <span className={styles['detail-label']}>Elemento</span>
          <div className={styles['item-details']}>
            <div className={styles['item-name']}>
              Ensalada César
              <span className={styles['item-quantity']}>x1</span>
            </div>
            <p className={styles['item-description']}>
              Lechuga, limón, pollo, huevo, anchoa, baguette.
            </p>
          </div>
        </div>

        <div className={styles['detail-section']}>
          <span className={styles['detail-label']}>Resumen del pago</span>
          <div className={styles['payment-summary']}>
            <div className={styles['summary-row']}>
              <span>Precio</span>
              <span>3000$</span>
            </div>
            <div className={styles['summary-row']}>
              <span>Total</span>
              <span>3000$</span>
            </div>
          </div>
        </div>

        <div className={styles['detail-row']}>
          <span className={styles['detail-label']}>Método de pago</span>
          <span className={styles['detail-value']}>Mercado Pago</span>
        </div>

        <div className={styles['detail-row']}>
          <span className={styles['detail-label']}>Fecha de envío</span>
          <span className={styles['detail-value']}>Hoy, 05:15 PM</span>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles['track-button']}>
          Seguir mi orden
        </button>
      </div>
    </div>
  )
}

export default Pedido