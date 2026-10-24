import { AlgoYolApp } from "../ui/AlgoYolApp";

// Every screen (roadmap, unit, profile, ...) now has its own real URL, set
// client-side via history.pushState. This catch-all lets a direct visit or
// refresh on one of those URLs still resolve to the same single-page app,
// which reads the path on mount to restore the matching screen.
export default function CatchAll() {
  return <AlgoYolApp />;
}
