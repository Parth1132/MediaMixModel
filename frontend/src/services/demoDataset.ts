import type { HarmonizedDataset, IngestedChannelData } from './csvParser';

export function getPreloadedDemoDataset(): HarmonizedDataset {
  const nWeeks = 104; // 2 years
  const weeks: string[] = [];
  const metaWeekly: Record<string, number> = {};
  const googleWeekly: Record<string, number> = {};
  const tiktokWeekly: Record<string, number> = {};
  const shopifyWeekly: Record<string, number> = {};

  let totalMeta = 0;
  let totalGoogle = 0;
  let totalTiktok = 0;
  let totalShopify = 0;

  const startDate = new Date(2024, 0, 1); // Jan 1, 2024 (Monday)

  for (let i = 0; i < nWeeks; i++) {
    const curDate = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
    const dateStr = curDate.toISOString().split('T')[0];
    weeks.push(dateStr);

    // Seasonality & Growth trend
    const season = Math.sin((2 * Math.PI * i) / 52);
    const trend = 1 + (i / nWeeks) * 0.35; // 35% annual growth

    // Spends
    const metaSpend = Math.round((14000 + 4000 * season + ((i * 37) % 3000)) * trend);
    const googleSpend = Math.round((9500 + 2500 * season + ((i * 53) % 2000)) * trend);
    const tiktokSpend = Math.round((6000 + 3000 * Math.cos((2 * Math.PI * i) / 26) + ((i * 29) % 1500)) * trend);

    // Revenue generation: baseline + media lift + random noise
    const baseline = 75000 * trend + 12000 * season;
    const metaLift = 38000 * (Math.pow(metaSpend, 1.1) / (Math.pow(metaSpend, 1.1) + Math.pow(15000, 1.1)));
    const googleLift = 26000 * (Math.pow(googleSpend, 0.95) / (Math.pow(googleSpend, 0.95) + Math.pow(8000, 0.95)));
    const tiktokLift = 18000 * (Math.pow(tiktokSpend, 1.0) / (Math.pow(tiktokSpend, 1.0) + Math.pow(7000, 1.0)));
    const noise = Math.sin(i * 71) * 3500;

    const netSales = Math.round(baseline + metaLift + googleLift + tiktokLift + noise);

    metaWeekly[dateStr] = metaSpend;
    googleWeekly[dateStr] = googleSpend;
    tiktokWeekly[dateStr] = tiktokSpend;
    shopifyWeekly[dateStr] = netSales;

    totalMeta += metaSpend;
    totalGoogle += googleSpend;
    totalTiktok += tiktokSpend;
    totalShopify += netSales;
  }

  const metaChannel: IngestedChannelData = {
    platformId: 'meta',
    platformLabel: 'Meta Ads (FB/IG)',
    isRevenueTarget: false,
    totalValue: totalMeta,
    weeksCount: nWeeks,
    startDate: weeks[0],
    endDate: weeks[weeks.length - 1],
    weeklySeries: metaWeekly,
  };

  const googleChannel: IngestedChannelData = {
    platformId: 'google',
    platformLabel: 'Google Ads',
    isRevenueTarget: false,
    totalValue: totalGoogle,
    weeksCount: nWeeks,
    startDate: weeks[0],
    endDate: weeks[weeks.length - 1],
    weeklySeries: googleWeekly,
  };

  const tiktokChannel: IngestedChannelData = {
    platformId: 'tiktok',
    platformLabel: 'TikTok Ads',
    isRevenueTarget: false,
    totalValue: totalTiktok,
    weeksCount: nWeeks,
    startDate: weeks[0],
    endDate: weeks[weeks.length - 1],
    weeklySeries: tiktokWeekly,
  };

  const shopifyTarget: IngestedChannelData = {
    platformId: 'shopify',
    platformLabel: 'Shopify Net Sales',
    isRevenueTarget: true,
    totalValue: totalShopify,
    weeksCount: nWeeks,
    startDate: weeks[0],
    endDate: weeks[weeks.length - 1],
    weeklySeries: shopifyWeekly,
  };

  return {
    weeks,
    channels: {
      meta: metaChannel,
      google: googleChannel,
      tiktok: tiktokChannel,
    },
    revenueTarget: shopifyTarget,
    summary: {
      totalRevenue: totalShopify,
      totalSpend: totalMeta + totalGoogle + totalTiktok,
      channelCount: 3,
      weeksCount: nWeeks,
      dateRangeStr: `${weeks[0]} to ${weeks[weeks.length - 1]} (104 Weeks / 2 Years)`,
    },
  };
}
