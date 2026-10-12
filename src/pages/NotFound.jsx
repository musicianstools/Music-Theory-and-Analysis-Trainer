import { ButtonLink } from '../components/ui.jsx';

export default function NotFound() {
  return (
    <div className="page narrow">
      <h1 className="title">Page not found</h1>
      <p className="lede">That page doesn't exist — it may have moved.</p>
      <ButtonLink to="/">Go home</ButtonLink>
    </div>
  );
}
