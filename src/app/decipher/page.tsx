import Decipher from "@/components/Decipher";
import TopBar from "@/components/TopBar";

export default function DecipherPage() {
  return (
    <div className="app-screen">
      <div className="app-content">
        <TopBar title="Decipher" backHref="/lesson" />
        <Decipher />
      </div>
    </div>
  );
}
