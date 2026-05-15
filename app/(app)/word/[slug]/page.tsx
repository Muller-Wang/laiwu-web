type Props = { params: Promise<{ slug: string }> };

export default async function WordDetailPlaceholder({ params }: Props) {
  const { slug } = await params;
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold">{decodeURIComponent(slug)}</h1>
      <p className="mt-4 text-text-muted">B4 阶段填充。</p>
    </div>
  );
}
