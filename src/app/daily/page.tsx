import Daily from "@/components/Daily";
import TopBar from "@/components/TopBar";

export default function DailyPage() {
  return (
    <div className="app-screen">
      <div className="app-content">
        <TopBar title="Tambay Daily" backHref="/home" />
        <Daily />
      </div>
    </div>
  );
}
