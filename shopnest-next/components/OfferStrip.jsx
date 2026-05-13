export default function OfferStrip() {
  const offers = [
    { label: '10% OFF', desc: 'on HDFC Cards' },
    { label: '₹500 OFF', desc: 'on orders above ₹2999' },
    { label: 'FREE', desc: 'Delivery above ₹499' },
    { label: 'EMI', desc: 'Starting ₹0 cost' },
    { label: 'EXTRA 5%', desc: 'NestCoins cashback' },
    { label: '15% OFF', desc: 'First order on App' },
  ];

  return (
    <div id="offers">
      {offers.map((o, i) => (
        <div className="offer-chip" key={i}>
          <span>{o.label}</span> {o.desc}
        </div>
      ))}
    </div>
  );
}
