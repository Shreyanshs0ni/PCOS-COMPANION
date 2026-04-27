import BottomNav from "@/components/BottomNav";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-dvh" style={{ background: "var(--bg)" }}>
      <div className="flex-1 pb-safe overflow-y-auto w-full">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
