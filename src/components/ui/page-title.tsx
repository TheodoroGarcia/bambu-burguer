export default function PageTitle({ title }: { title: string }) {
  return (
    <div className="p-5">
      <h1 className="text-xl font-bold text-primary">{title}</h1>
    </div>
  );
}
