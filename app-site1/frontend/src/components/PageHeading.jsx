export default function PageHeading({ eyebrow, title, description, action }) {
  return <div className="heading">
    <div><small className="eyebrow">{eyebrow}</small><h1>{title}</h1><p>{description}</p></div>
    {action}
  </div>;
}
