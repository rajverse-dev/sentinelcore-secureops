export interface AssetRecord {
  id: string;
  name: string;
  type: string;
  provider: string;
  region: string;
  environment: string;
  identifier: string;
  status: string;
  riskLevel: string;
  owner?: string;
  createdAt?: string;
}

export const assetData: AssetRecord[] = [];
