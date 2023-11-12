const Heading = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
};

export default Heading;
