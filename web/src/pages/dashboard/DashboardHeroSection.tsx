type DashboardHeroSectionProps = {
  title: string;
  subtitle: string;
};

const DashboardHeroSection = ({ title, subtitle }: DashboardHeroSectionProps) => {
  return (
    <div className="space-y-2">
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
      <p className="text-lg text-muted-foreground">{subtitle}</p>
    </div>
  );
};

export default DashboardHeroSection;
