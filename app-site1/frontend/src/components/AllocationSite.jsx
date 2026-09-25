export default function AllocationSite({ number, title, subtitle, state, fragments }) {
  return <div className="allocation-site">
    <div className="allocation-head">
      <span className={'site-number ' + (number === '01' ? 'site-a' : 'site-b')}>{number}</span>
      <div><b>{title}</b><small>{subtitle}</small></div>
      <span className={'pill ' + (number === '01' ? 'pill-good' : 'pill-wait')}>{state}</span>
    </div>
    <div className="fragment-pills">{fragments.map(fragment => <div key={fragment[0]}>
      <b>{fragment[0]}</b><small>{fragment[1]}</small><strong>{fragment[2]}</strong>
    </div>)}</div>
  </div>;
}
