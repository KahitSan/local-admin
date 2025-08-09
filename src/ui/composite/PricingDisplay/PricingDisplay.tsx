
interface PricingDisplayProps {
  price: number;
  payment?: number;
  spaceType?: string;
  duration?: number;
}

export const PricingDisplay: React.FC<PricingDisplayProps> = ({
  price,
  payment = 0,
  spaceType,
  duration
}) => {
  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.3)',
      border: 'var(--ks-border-hud-thin)',
      padding: 'var(--ks-space-4)',
      margin: 'var(--ks-space-3) 0',
      fontFamily: 'var(--ks-font-digital)'
    }}>
      {spaceType && duration && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--ks-space-1)', fontSize: 'var(--ks-font-size-sm)' }}>
          <span>{spaceType} - {duration}h</span>
          <span>₱{price}</span>
        </div>
      )}
      
      {payment > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--ks-space-1)', fontSize: 'var(--ks-font-size-sm)' }}>
            <span>Amount Due</span>
            <span>₱{price}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--ks-space-1)', fontSize: 'var(--ks-font-size-sm)' }}>
            <span>Payment</span>
            <span>₱{payment}</span>
          </div>
        </>
      )}
      
      <div style={{
        borderTop: '1px solid rgba(201, 169, 97, 0.3)',
        paddingTop: 'var(--ks-space-2)',
        marginTop: 'var(--ks-space-2)',
        fontSize: 'var(--ks-font-size-lg)',
        color: 'var(--ks-hud-primary)',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>{payment > 0 ? 'Balance' : 'Total Amount'}</span>
        <span>₱{payment > 0 ? Math.max(0, price - payment) : price}</span>
      </div>
    </div>
  );
};