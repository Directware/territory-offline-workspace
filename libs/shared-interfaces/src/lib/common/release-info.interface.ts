export interface ReleaseInfo
{
  version: string;
  winFileName: string;
  macFileName: string;
  linuxFileName: string;
  creation: string;
  shouldUpdate?: boolean;
  currentOsDownloadUrl?: string;
  hasError?: boolean;
}
