import Image from "next/image";
import styles from "./MascotSays.module.css";

export default function MascotSays({ tagalog, english }: { tagalog: string; english?: string }) {
  return (
    <div className={styles.row}>
      <Image src="/headshot.png" alt="Tambay" width={48} height={48} className={styles.avatar} />
      <div className={styles.bubble}>
        <strong>{tagalog}</strong>
        {english && <small>{english}</small>}
      </div>
    </div>
  );
}
