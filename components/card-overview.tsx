import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const CardOverview = ({
  title,
  description,
  total,
  icon: Icon,
}: {
  title: string;
  description?: string;
  total: string | number;
  icon: LucideIcon;
}) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>

        <div className="relative w-auto pl-4 flex-initial">
          <div className="text-white p-3 text-center inline-flex items-center justify-center shadow-lg rounded-full">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{total}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default CardOverview;
