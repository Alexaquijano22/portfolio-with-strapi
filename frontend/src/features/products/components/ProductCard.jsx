import { Card } from '../../../shared/components/Card.jsx';
import { Badge } from '../../../shared/components/Badge.jsx';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function ProductCard({ product }) {
  const { title, price, category, image, rating } = product;

  return (
    <Card className="flex h-full flex-col gap-3">
      <div className="flex h-44 items-center justify-center rounded-lg bg-neutral-100 p-4">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>

      <h3 className="line-clamp-2 font-medium text-text" title={title}>
        {title}
      </h3>

      <div className="mt-auto flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-text">
            {typeof price === 'number' ? priceFormatter.format(price) : ''}
          </span>
          {rating && (
            <span className="whitespace-nowrap text-sm text-muted">
              <span aria-hidden="true" className="text-accent">★</span> {rating.rate} ({rating.count})
            </span>
          )}
        </div>

        {category && <Badge className="capitalize" variant="accent">{category}</Badge>}
      </div>
    </Card>
  );
}

export default ProductCard;
