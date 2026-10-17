import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-screen">
      <TopBar />
      <div className="app-content">{children}</div>
      <BottomNav />
    </div>
  );
}