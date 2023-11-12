import Navbar from '@/components/navbar';

const SetupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="flex-col max-w-screen-2xl mx-auto">
        <main className="flex-1 space-y-4 sm:p-8 pt-6">{children}</main>
      </div>
    </>
  );
};

export default SetupLayout;
