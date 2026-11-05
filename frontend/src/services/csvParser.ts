export interface IngestedChannelData {
  platformId: string;
  platformLabel: string;
  isRevenueTarget: boolean;
  totalValue: number;
  weeksCount: number;
  startDate: string;
  endDate: string;
  weeklySeries: Record<string, number>; // dateStr -> value
}

export interface HarmonizedDataset {
  weeks: string[]; // sorted ISO dates (Monday of each week)
  channels: Record<string, IngestedChannelData>; // channel key -> details
  revenueTarget: IngestedChannelData | null;
  summary: {
    totalRevenue: number;
    totalSpend: number;
    channelCount: number;
    weeksCount: number;
    dateRangeStr: string;
  };
}

export interface ParseResult {
  platformId: string;
  platformName: string;
  isRevenue: boolean;
  rowCount: number;
  weeklyData: Record<string, number>;
  totalAmount: number;
  minDate: string;
  maxDate: string;
  detectedHeaders: {
    dateCol: string;
    valueCol: string;
  };
}

// Clean currency and commas
export function parseNumber(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Normalize any date string to Monday of that week in ISO format (YYYY-MM-DD)
export function getMondayOfWeek(dateStr: string): string | null {
  if (!dateStr) return null;
  const clean = dateStr.trim().replace(/^["']|["']$/g, '');
  let d: Date | null = null;

  // Try direct ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(clean)) {
    d = new Date(clean.slice(0, 10));
  } else if (/^\d{2}\/\d{2}\/\d{4}/.test(clean)) {
    // Check MM/DD/YYYY vs DD/MM/YYYY
    const parts = clean.split('/');
    const p1 = parseInt(parts[0], 10);
    const p2 = parseInt(parts[1], 10);
    const p3 = parseInt(parts[2], 10);
    if (p1 > 12) {
      // DD/MM/YYYY
      d = new Date(p3, p2 - 1, p1);
    } else {
      // MM/DD/YYYY
      d = new Date(p3, p1 - 1, p2);
    }
  } else {
    d = new Date(clean);
  }

  if (!d || isNaN(d.getTime())) return null;

  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
}

// Detect Platform & Column Signatures
export function detectPlatformSignature(headers: string[]): {
  platformId: string;
  platformName: string;
  isRevenue: boolean;
  dateCol: string;
  valueCol: string;
} {
  const norm = headers.map((h) => h.toLowerCase().trim());

  // 1. Meta Ads Signature
  if (norm.some((h) => h.includes('amount spent') || h.includes('reporting starts') || h.includes('ad set name'))) {
    const dateCol = headers[norm.findIndex((h) => h.includes('reporting starts') || h.includes('date') || h.includes('day'))] || headers[0];
    const valueCol = headers[norm.findIndex((h) => h.includes('amount spent') || h.includes('spend') || h.includes('cost'))] || headers[1];
    return { platformId: 'meta', platformName: 'Meta Ads', isRevenue: false, dateCol, valueCol };
  }

  // 2. Google Ads Signature
  if (norm.some((h) => h === 'cost' || (h.includes('impr') && norm.some((x) => x.includes('campaign'))))) {
    const dateCol = headers[norm.findIndex((h) => h === 'day' || h.includes('date'))] || headers[0];
    const valueCol = headers[norm.findIndex((h) => h === 'cost' || h.includes('spend'))] || headers[1];
    return { platformId: 'google', platformName: 'Google Ads', isRevenue: false, dateCol, valueCol };
  }

  // 3. TikTok Ads Signature
  if (norm.some((h) => h.includes('stat date') || h.includes('tiktok') || h.includes('total cost'))) {
    const dateCol = headers[norm.findIndex((h) => h.includes('stat date') || h.includes('date'))] || headers[0];
    const valueCol = headers[norm.findIndex((h) => h.includes('total cost') || h.includes('cost') || h.includes('spend'))] || headers[1];
    return { platformId: 'tiktok', platformName: 'TikTok Ads', isRevenue: false, dateCol, valueCol };
  }

  // 4. Amazon Ads Signature
  if (norm.some((h) => h.includes('amazon') || (h.includes('spend') && norm.some((x) => x.includes('7 day'))))) {
    const dateCol = headers[norm.findIndex((h) => h.includes('date') || h.includes('day'))] || headers[0];
    const valueCol = headers[norm.findIndex((h) => h.includes('spend') || h.includes('cost'))] || headers[1];
    return { platformId: 'amazon', platformName: 'Amazon Ads', isRevenue: false, dateCol, valueCol };
  }

  // 5. LinkedIn Ads Signature
  if (norm.some((h) => h.includes('total spent') || h.includes('start date (utc)') || h.includes('linkedin'))) {
    const dateCol = headers[norm.findIndex((h) => h.includes('start date') || h.includes('date'))] || headers[0];
    const valueCol = headers[norm.findIndex((h) => h.includes('total spent') || h.includes('spent') || h.includes('cost'))] || headers[1];
    return { platformId: 'linkedin', platformName: 'LinkedIn Ads', isRevenue: false, dateCol, valueCol };
  }

  // 6. Shopify / Stripe / Revenue Signature
  if (norm.some((h) => h.includes('total sales') || h.includes('net sales') || h.includes('gross sales') || h.includes('revenue') || h.includes('orders'))) {
    const dateCol = headers[norm.findIndex((h) => h.includes('day') || h.includes('date') || h.includes('month'))] || headers[0];
    const valueCol = headers[norm.findIndex((h) => h.includes('total sales') || h.includes('net sales') || h.includes('revenue') || h.includes('gross sales'))] || headers[1];
    return { platformId: 'shopify', platformName: 'Shopify / Net Sales', isRevenue: true, dateCol, valueCol };
  }

  // 7. Generic Fallback
  const dateIdx = norm.findIndex((h) => h.includes('date') || h.includes('day') || h.includes('time') || h.includes('week'));
  const dateCol = dateIdx !== -1 ? headers[dateIdx] : headers[0];

  const revIdx = norm.findIndex((h) => h.includes('revenue') || h.includes('sales') || h.includes('conversion value'));
  if (revIdx !== -1) {
    return { platformId: 'revenue', platformName: 'Revenue Target', isRevenue: true, dateCol, valueCol: headers[revIdx] };
  }

  const spendIdx = norm.findIndex((h) => h.includes('spend') || h.includes('cost') || h.includes('amount') || h.includes('budget'));
  const valueCol = spendIdx !== -1 ? headers[spendIdx] : (headers[1] || headers[0]);

  return {
    platformId: 'custom_ad_channel',
    platformName: 'Custom Channel',
    isRevenue: false,
    dateCol,
    valueCol,
  };
}

// Parse Raw CSV Text
export function parseCSV(csvText: string, filename = 'data.csv'): ParseResult {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('CSV file contains insufficient rows.');
  }

  // Parse header
  const delimiter = lines[0].includes('\t') ? '\t' : lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(delimiter).map((h) => h.replace(/^["']|["']$/g, '').trim());

  const sig = detectPlatformSignature(headers);
  const dateIdx = headers.indexOf(sig.dateCol);
  const valIdx = headers.indexOf(sig.valueCol);

  if (dateIdx === -1 || valIdx === -1) {
    throw new Error(`Unable to identify date or metric column in ${filename}`);
  }

  const weeklyData: Record<string, number> = {};
  let totalAmount = 0;
  let minDate = '9999-99-99';
  let maxDate = '0000-00-00';
  let rowCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(delimiter);
    if (row.length <= Math.max(dateIdx, valIdx)) continue;

    const rawDate = row[dateIdx];
    const monday = getMondayOfWeek(rawDate);
    if (!monday) continue;

    const val = parseNumber(row[valIdx]);
    weeklyData[monday] = (weeklyData[monday] || 0) + val;
    totalAmount += val;
    rowCount++;

    if (monday < minDate) minDate = monday;
    if (monday > maxDate) maxDate = monday;
  }

  return {
    platformId: sig.platformId,
    platformName: sig.platformName,
    isRevenue: sig.isRevenue,
    rowCount,
    weeklyData,
    totalAmount: Math.round(totalAmount),
    minDate,
    maxDate,
    detectedHeaders: {
      dateCol: sig.dateCol,
      valueCol: sig.valueCol,
    },
  };
}

// Harmonize Multiple Parsed Files into One Unified Dataset
export function harmonizeDatasets(parsedFiles: ParseResult[]): HarmonizedDataset {
  // Collect all unique weeks across all files
  const weekSet = new Set<string>();
  parsedFiles.forEach((f) => {
    Object.keys(f.weeklyData).forEach((w) => weekSet.add(w));
  });

  const sortedWeeks = Array.from(weekSet).sort();

  const channels: Record<string, IngestedChannelData> = {};
  let revenueTarget: IngestedChannelData | null = null;
  let totalSpend = 0;
  let totalRevenue = 0;

  parsedFiles.forEach((f, idx) => {
    const key = f.isRevenue ? 'target_revenue' : `${f.platformId}_${idx}`;
    const channelItem: IngestedChannelData = {
      platformId: f.platformId,
      platformLabel: f.platformName,
      isRevenueTarget: f.isRevenue,
      totalValue: f.totalAmount,
      weeksCount: Object.keys(f.weeklyData).length,
      startDate: f.minDate,
      endDate: f.maxDate,
      weeklySeries: f.weeklyData,
    };

    if (f.isRevenue) {
      revenueTarget = channelItem;
      totalRevenue += f.totalAmount;
    } else {
      channels[key] = channelItem;
      totalSpend += f.totalAmount;
    }
  });

  const dateRangeStr =
    sortedWeeks.length > 0
      ? `${sortedWeeks[0]} to ${sortedWeeks[sortedWeeks.length - 1]}`
      : 'No timeline detected';

  return {
    weeks: sortedWeeks,
    channels,
    revenueTarget,
    summary: {
      totalRevenue,
      totalSpend,
      channelCount: Object.keys(channels).length,
      weeksCount: sortedWeeks.length,
      dateRangeStr,
    },
  };
}
