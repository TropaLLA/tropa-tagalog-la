import { EmojiSmile, Fire, LightningChargeFill, Calendar2WeekFill, TrophyFill, type Icon } from "react-bootstrap-icons";
import type { AchievementId } from "@/lib/progress";

export const ACHIEVEMENT_ICONS: Record<AchievementId, Icon> = {
  welcome: EmojiSmile,
  day1: Fire,
  day3: LightningChargeFill,
  week: Calendar2WeekFill,
  month: TrophyFill,
};
