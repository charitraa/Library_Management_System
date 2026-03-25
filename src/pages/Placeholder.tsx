import Layout from "@/components/Layout";

interface PlaceholderProps {
  title: string;
}

export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">Page Under Construction</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              We're working hard to bring you the {title.toLowerCase()} management features.
              Please check back soon or continue prompting to fill in this page's content.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
