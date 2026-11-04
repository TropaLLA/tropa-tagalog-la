import Situations from "@/components/Situations";
import TopBar from "@/components/TopBar";

export default function SituationsPage() {
  return (
    <div className="app-screen">
      <div className="app-content">
        <TopBar title="Ano'ng Gagawin Mo?" backHref="/lesson" />
        <Situations />
      </div>
    </div>
  );
}
