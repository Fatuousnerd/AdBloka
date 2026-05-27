export interface BlockerType {
  classify: (req: any) => {
    domain: string;
    isAd: boolean;
    score: number;
  };
}
