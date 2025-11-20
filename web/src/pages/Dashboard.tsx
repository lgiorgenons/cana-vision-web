import { Layout } from "@/components/Layout";

const Dashboard = () => {
  return (
    <Layout title="Dashboard">
      <section className="flex flex-1 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50">
        <p className="text-slate-400">Conteudo principal sera exibido aqui.</p>
      </section>
    </Layout>
  );
};

export default Dashboard;
