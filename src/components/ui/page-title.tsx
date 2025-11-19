export default function PageTitle({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-xl font-bold text-primary">{title}</h1>
    </div>
  );
}
