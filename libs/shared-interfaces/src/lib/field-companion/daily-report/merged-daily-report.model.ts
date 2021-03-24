export interface MergedDailyReport
{
  videos: number;
  returnVisits: number;
  duration: number;
  deliveries: number;
  studies: number;
  durationPhrase: string;
}

export function emptyMergedDailyReport(): MergedDailyReport
{
  return {
    videos: 0,
    returnVisits: 0,
    duration: 0,
    deliveries: 0,
    studies: 0,
    durationPhrase: "0h",
  };
}
