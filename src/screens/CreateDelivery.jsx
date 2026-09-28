import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen, { TopBar } from '../components/layout/Screen';
import Button from '../components/ui/Button';
import Field from '../components/ui/Field';
import Toggle from '../components/ui/Toggle';
import Segmented from '../components/ui/Segmented';
import Icon from '../components/ui/Icon';
import { useStore } from '../state/store';
import { ZONES } from '../data/locations';
import { PACKAGE_SIZES, sizeById, ITEM_TYPES } from '../data/packages';

const STEP_META = [
  { title: 'Pickup location', heading: 'Where should we pick up from?' },
  { title: 'Delivery location', heading: 'Where is it going?' },
  { title: 'Package details', heading: 'Tell us about the package' },
  { title: 'Pickup time', heading: 'When should we collect it?' },
];

const TIME_SLOTS = (() => {
  const slots = [];
  for (let h = 8; h <= 19; h += 1) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
})();

const todayISO = () => new Date().toISOString().slice(0, 10);

const digits = (s) => String(s || '').replace(/\D/g, '');
const validPhone = (s) => [10, 11].includes(digits(s).length);

export default function CreateDelivery() {
  const navigate = useNavigate();
  const { draft, updateDraft, step, setStep } = useStore();
  const [errors, setErrors] = useState({});

  const meta = STEP_META[step];

  const validate = (s) => {
    const e = {};
    if (s === 0) {
      if (!draft.pickup.zoneId) e.pickupZone = 'Choose the pickup area';
      if (draft.pickup.line1.trim().length < 6) e.pickupLine = 'Add a street address we can find';
      if (!draft.pickup.contactName.trim()) e.pickupName = 'Who should the partner ask for?';
      if (!validPhone(draft.pickup.contactPhone)) e.pickupPhone = 'Enter a valid phone number';
    }
    if (s === 1) {
      if (!draft.dropoff.zoneId) e.dropZone = 'Choose the delivery area';
      if (draft.dropoff.line1.trim().length < 6) e.dropLine = 'Add a street address we can find';
      if (!draft.dropoff.recipientName.trim()) e.dropName = 'Who is receiving this?';
      if (!validPhone(draft.dropoff.recipientPhone)) e.dropPhone = 'Enter a valid phone number';
    }
    if (s === 2) {
      const size = sizeById(draft.package.size);
      const w = Number(draft.package.weightKg);
      if (!draft.package.weightKg || Number.isNaN(w) || w <= 0) e.weight = 'Add an approximate weight';
      else if (w > size.maxKg) e.weight = `Above ${size.maxKg} kg — choose ${w <= 15 ? 'Medium' : 'Large'} parcel instead`;
    }
    if (s === 3 && draft.schedule.mode === 'scheduled') {
      if (!draft.schedule.date) e.date = 'Pick a date';
      if (!draft.schedule.time) e.time = 'Pick a time';
    }
    return e;
  };

  const goNext = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/estimate');
    }
  };

  const goBack = () => {
    if (step === 0) navigate('/home');
    else setStep(step - 1);
    setErrors({});
  };

  const zoneOptions = (
    <>
      <option value="">Choose area…</option>
      {ZONES.map((z) => (
        <option key={z.id} value={z.id}>
          {z.name}
        </option>
      ))}
    </>
  );

  return (
    <Screen
      onBack={goBack}
      title={meta.title}
      subtitle={`Step ${step + 1} of ${STEP_META.length}`}
      footer={
        <Button block size="lg" onClick={goNext} iconRight={step < 3 ? 'arrowRight' : undefined} icon={step === 3 ? 'sparkle' : undefined}>
          {step < 3 ? 'Continue' : 'See delivery estimate'}
        </Button>
      }
    >
      <div className="stepper" aria-hidden="true">
        {STEP_META.map((_, i) => (
          <span
            key={i}
            className={`stepper__seg ${i < step ? 'is-done' : ''} ${i === step ? 'is-current' : ''}`}
          />
        ))}
        <span className="stepper__count num">
          {step + 1}/{STEP_META.length}
        </span>
      </div>

      <h2 style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
        {meta.heading}
      </h2>

      {step === 0 ? (
        <div className="formgrid">
          <Field label="Pickup area" error={errors.pickupZone} icon="mapPin" htmlFor="p-zone">
            <select
              id="p-zone"
              className="select"
              value={draft.pickup.zoneId}
              onChange={(e) => updateDraft({ pickup: { zoneId: e.target.value } })}
            >
              {zoneOptions}
            </select>
          </Field>
          <Field label="Street address" error={errors.pickupLine} htmlFor="p-line">
            <input
              id="p-line"
              className="input"
              placeholder="e.g. 14 Rumuola Road, by the junction"
              value={draft.pickup.line1}
              onChange={(e) => updateDraft({ pickup: { line1: e.target.value } })}
            />
          </Field>
          <Field label="Contact name" error={errors.pickupName} icon="user" htmlFor="p-name">
            <input
              id="p-name"
              className="input"
              placeholder="Who the partner should ask for"
              value={draft.pickup.contactName}
              onChange={(e) => updateDraft({ pickup: { contactName: e.target.value } })}
            />
          </Field>
          <Field label="Contact phone" error={errors.pickupPhone} icon="phoneCall" htmlFor="p-phone">
            <input
              id="p-phone"
              className="input"
              inputMode="tel"
              placeholder="0803 123 4567"
              value={draft.pickup.contactPhone}
              onChange={(e) => updateDraft({ pickup: { contactPhone: e.target.value } })}
            />
          </Field>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="formgrid">
          <Field label="Recipient name" error={errors.dropName} icon="user" htmlFor="d-name">
            <input
              id="d-name"
              className="input"
              placeholder="Full name of the receiver"
              value={draft.dropoff.recipientName}
              onChange={(e) => updateDraft({ dropoff: { recipientName: e.target.value } })}
            />
          </Field>
          <Field label="Recipient phone" error={errors.dropPhone} icon="phoneCall" htmlFor="d-phone">
            <input
              id="d-phone"
              className="input"
              inputMode="tel"
              placeholder="0803 123 4567"
              value={draft.dropoff.recipientPhone}
              onChange={(e) => updateDraft({ dropoff: { recipientPhone: e.target.value } })}
            />
          </Field>
          <Field label="Delivery area" error={errors.dropZone} icon="mapPin" htmlFor="d-zone">
            <select
              id="d-zone"
              className="select"
              value={draft.dropoff.zoneId}
              onChange={(e) => updateDraft({ dropoff: { zoneId: e.target.value } })}
            >
              {zoneOptions}
            </select>
          </Field>
          <Field label="Street address" error={errors.dropLine} htmlFor="d-line">
            <input
              id="d-line"
              className="input"
              placeholder="e.g. 7 Marine Base road, Waterlines"
              value={draft.dropoff.line1}
              onChange={(e) => updateDraft({ dropoff: { line1: e.target.value } })}
            />
          </Field>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="formgrid">
          <Field label="Package size">
            <div className="sizes" role="radiogroup" aria-label="Package size">
              {PACKAGE_SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={draft.package.size === s.id}
                  className={`sizes__item ${draft.package.size === s.id ? 'sizes__item--active' : ''}`}
                  onClick={() => updateDraft({ package: { size: s.id } })}
                >
                  <span className="sizes__label">
                    {s.label}
                    {draft.package.size === s.id ? (
                      <span className="sizes__check">
                        <Icon name="check" size={15} strokeWidth={3} />
                      </span>
                    ) : null}
                  </span>
                  <span className="sizes__hint">{s.hint}</span>
                </button>
              ))}
            </div>
          </Field>

          <Field label="What's inside?" hint="Helps us match the right partner">
            <div className="itemtypes" role="radiogroup" aria-label="Item type">
              {ITEM_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={draft.itemType === t.id}
                  className={`itemtypes__item ${draft.itemType === t.id ? 'itemtypes__item--active' : ''}`}
                  onClick={() => updateDraft({ itemType: t.id })}
                >
                  <Icon name={t.icon} size={14} />
                  {t.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Approximate weight" error={errors.weight} htmlFor="pkg-weight">
            <div className="weightrow">
              <input
                id="pkg-weight"
                className="input"
                type="number"
                min="0.1"
                step="0.5"
                inputMode="decimal"
                placeholder="e.g. 2"
                value={draft.package.weightKg}
                onChange={(e) => updateDraft({ package: { weightKg: e.target.value } })}
              />
              <span className="weightunit">kg</span>
            </div>
          </Field>

          <Field label="Description (optional)" htmlFor="pkg-desc">
            <textarea
              id="pkg-desc"
              className="textarea"
              placeholder="e.g. One sealed carton of shoes"
              value={draft.package.description}
              onChange={(e) => updateDraft({ package: { description: e.target.value } })}
            />
          </Field>

          <Toggle
            id="pkg-fragile"
            checked={draft.package.fragile}
            onChange={(v) => updateDraft({ package: { fragile: v } })}
            label="Fragile — handle with care"
            description="We'll only show partners equipped for fragile items"
          />
        </div>
      ) : null}

      {step === 3 ? (
        <div className="formgrid">
          <Segmented
            ariaLabel="Pickup preference"
            value={draft.schedule.mode}
            onChange={(mode) => updateDraft({ schedule: { mode } })}
            options={[
              {
                id: 'asap',
                label: 'As soon as possible',
                hint: 'Partner leaves right away',
                icon: <path d="M13 2L3 14h8l-1 8 11-13h-9l1-7z" />,
              },
              {
                id: 'scheduled',
                label: 'Schedule pickup',
                hint: 'Choose date & time',
                icon: (
                  <>
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M8 3v4" />
                    <path d="M16 3v4" />
                    <path d="M3 10h18" />
                  </>
                ),
              },
            ]}
          />

          {draft.schedule.mode === 'scheduled' ? (
            <>
              <Field label="Date" error={errors.date} icon="calendar" htmlFor="sch-date">
                <input
                  id="sch-date"
                  className="input"
                  type="date"
                  min={todayISO()}
                  value={draft.schedule.date}
                  onChange={(e) => updateDraft({ schedule: { date: e.target.value } })}
                />
              </Field>
              <Field label="Time" error={errors.time} icon="clock" htmlFor="sch-time">
                <select
                  id="sch-time"
                  className="select"
                  value={draft.schedule.time}
                  onChange={(e) => updateDraft({ schedule: { time: e.target.value } })}
                >
                  <option value="">Choose a time…</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          ) : (
            <div className="matchnote">
              <span className="matchnote__icon">
                <Icon name="bolt" size={16} />
              </span>
              <span className="matchnote__text">
                We'll alert nearby partners the moment you confirm. Most pickups in{' '}
                <b>Port Harcourt</b> happen within 15 minutes.
              </span>
            </div>
          )}
        </div>
      ) : null}
    </Screen>
  );
}
