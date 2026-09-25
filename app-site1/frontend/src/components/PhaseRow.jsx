export default function PhaseRow({ name, phase, done, current }) {
  return <div className={'phase-row ' + (current ? 'current' : '')}>
    <i>{done ? '✓' : current ? '•' : ''}</i><span>{name}</span><small>{phase}</small>
  </div>;
}
