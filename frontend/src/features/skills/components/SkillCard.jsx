import { Card } from '../../../shared/components/Card.jsx';
import { Badge } from '../../../shared/components/Badge.jsx';

// Renders a single skill. The icon is nullable: when present we show the image,
// when null we show the skill's initial in a styled circle (aria-hidden) — never a
// broken-image element.
export function SkillCard({ skill }) {
  return (
    <Card className="flex flex-col items-center gap-3 text-center">
      {skill.icon ? (
        <img src={skill.icon.url} alt={skill.name} className="h-8 w-8 object-contain" />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent"
        >
          {skill.name?.[0]?.toUpperCase()}
        </span>
      )}

      <p className="font-medium text-text">{skill.name}</p>
      <Badge variant="accent">{skill.category}</Badge>
    </Card>
  );
}

export default SkillCard;
