import { useNavigate, useParams } from 'react-router-dom';
import Screen from '../components/layout/Screen';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import Avatar from '../components/ui/Avatar';
import SummaryList from '../components/delivery/SummaryList';
import { useStore } from '../state/store';
import { partnerById } from '../data/partners';
import { zoneName } from '../data/locations';

/** Success state right after booking. */
export default function Created() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deliveryById } = useStore();
  const delivery = deliveryById(id);

  if (!delivery) {
    return (
      <Screen title="Delivery not found">
        <Button block onClick={() => navigate('/home')}>
          Back to home
        </Button>
      </Screen>
    );
  }

  const partner = partnerById(delivery.partnerId);

  return (
    <Screen
      footer={
        <>
          <Button block size="lg" icon="navigation" onClick={() => navigate(`/track/${delivery.id}`)}>
            Track delivery
          </Button>
          <Button block size="md" variant="secondary" onClick={() => navigate('/home')}>
            Back to home
          </Button>
        </>
      }
    >
      <div className="created">
        <span className="created__mark">
          <Icon name="check" size={44} strokeWidth={3} />
        </span>
        <div>
          <h1 className="created__title">Delivery request created</h1>
          <p className="created__sub" style={{ marginTop: 8 }}>
            {partner.name} has your package request and is getting ready to move.
          </p>
        </div>
      </div>

      <div className="card">
        <SummaryList
          rows={[
            { label: 'Delivery ID', value: delivery.id, emphasis: true, num: true },
            {
              label: 'Partner',
              value: (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <Avatar src={partner.photo} name={partner.name} size={22} />
                  {partner.name}
                </span>
              ),
            },
            { label: 'Pickup', value: zoneName(delivery.pickupZone) },
            { label: 'Destination', value: zoneName(delivery.dropoffZone) },
            { label: 'Estimated pickup', value: delivery.pickupEta, emphasis: true, num: true },
          ]}
        />
      </div>
    </Screen>
  );
}
