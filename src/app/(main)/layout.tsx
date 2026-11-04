import BottomNav from "@/components/BottomNav";

// Each page renders its own <TopBar title=... /> so it can set the title and back target.
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-screen">
      <div className="app-content">{children}</div>
      <BottomNav />
    </div>
  );
}