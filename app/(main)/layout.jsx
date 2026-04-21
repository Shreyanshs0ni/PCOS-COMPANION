import BottomNav from "@/components/BottomNav";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-screen">
      <div className="flex-1 pb-20 overflow-y-auto w-full">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
