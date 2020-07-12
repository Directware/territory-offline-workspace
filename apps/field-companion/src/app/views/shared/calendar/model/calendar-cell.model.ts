export interface CalendarCell
{
  text: string;
  dayIndex: number;
  date: Date;
  hasDot?: boolean;
  hasData?: boolean;
}
