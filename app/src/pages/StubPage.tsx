import { PageShell } from "../components/layout";
import { Card } from "../components/ui";

interface StubPageProps {
  title: string;
  description: string;
}

export function StubPage({ title, description }: StubPageProps) {
  return (
    <PageShell title={title}>
      <Card>
        <div className="flex flex-col items-center gap-4 py-8 text-center text-gray-500">
          <span className="text-5xl">🚧</span>
          <p className="text-lg font-medium">En construcción</p>
          <p className="text-sm">{description}</p>
        </div>
      </Card>
    </PageShell>
  );
}
