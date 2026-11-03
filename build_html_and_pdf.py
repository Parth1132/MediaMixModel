"""
build_html_and_pdf.py
Generates the complete, publication-grade HTML book and compiles it to PDF using Chrome Headless.
"""

import os
import subprocess

html_path = r"D:\MediaMixModel\guide.html"
pdf_path = r"D:\MediaMixModel\The_Definitive_Guide_to_Media_Mix_Modeling.pdf"

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>The Definitive Guide to Media Mix Modeling (MMM)</title>
<style>
  /* ==========================================================================
     GLOBAL PRINT & TYPOGRAPHY SYSTEM
     ========================================================================== */
  @page {
    size: A4 portrait;
    margin: 14mm 12mm 16mm 12mm;
    @top-right {
      content: "The Definitive Guide to Media Mix Modeling (MMM)";
      font-size: 7.5pt;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #94A3B8;
      font-weight: 600;
    }
    @bottom-center {
      content: "Confidential & Proprietary • Media Mix Model Blueprint";
      font-size: 7.5pt;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #94A3B8;
    }
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1E293B;
    background-color: #FFFFFF;
    line-height: 1.55;
    font-size: 9.5pt;
    margin: 0;
    padding: 0;
  }

  /* Page Break Utilities */
  .page-break {
    page-break-after: always;
    break-after: page;
  }
  .no-break {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Headings */
  h1, h2, h3, h4 {
    color: #0F172A;
    font-weight: 700;
    margin-top: 0;
  }
  h1 {
    font-size: 20pt;
    line-height: 1.2;
    border-bottom: 2.5px solid #2563EB;
    padding-bottom: 6px;
    margin-bottom: 12px;
  }
  h2 {
    font-size: 13.5pt;
    color: #1E3A8A;
    margin-top: 14px;
    margin-bottom: 8px;
    border-left: 4px solid #2563EB;
    padding-left: 8px;
  }
  h3 {
    font-size: 11pt;
    color: #0F172A;
    margin-top: 10px;
    margin-bottom: 6px;
  }

  p {
    margin-top: 0;
    margin-bottom: 8px;
    text-align: justify;
  }

  /* ==========================================================================
     CALLOUT BOXES & CARDS
     ========================================================================== */
  .card {
    border-radius: 8px;
    padding: 10px 14px;
    margin-bottom: 12px;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  
  .card-intuition {
    background-color: #EFF6FF;
    border: 1.5px solid #3B82F6;
    border-left: 6px solid #2563EB;
  }
  .card-intuition-title {
    font-size: 10pt;
    font-weight: 800;
    color: #1E40AF;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .card-business {
    background-color: #ECFDF5;
    border: 1.5px solid #10B981;
    border-left: 6px solid #059669;
  }
  .card-business-title {
    font-size: 10pt;
    font-weight: 800;
    color: #065F46;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .card-warning {
    background-color: #FEF2F2;
    border: 1.5px solid #EF4444;
    border-left: 6px solid #DC2626;
  }
  .card-warning-title {
    font-size: 10pt;
    font-weight: 800;
    color: #991B1B;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* ==========================================================================
     FORMULA CARDS (READABLE, SPACIOUS, EXECUTIVE STYLE)
     ========================================================================== */
  .formula-box {
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
    color: #F8FAFC;
    border-radius: 8px;
    padding: 14px 18px;
    margin: 10px 0 12px 0;
    page-break-inside: avoid;
    break-inside: avoid;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  .formula-label {
    font-size: 8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #38BDF8;
    margin-bottom: 6px;
  }
  .formula-display {
    font-size: 13pt;
    font-weight: 700;
    font-family: "Courier New", Courier, monospace;
    text-align: center;
    padding: 6px 0;
    letter-spacing: 0.5px;
  }
  .formula-display .hl-sales { color: #38BDF8; }
  .formula-display .hl-base { color: #94A3B8; }
  .formula-display .hl-media { color: #4ADE80; }
  .formula-display .hl-control { color: #FBBF24; }
  .formula-display .hl-noise { color: #F87171; }
  
  .formula-subtitle {
    font-size: 8pt;
    color: #CBD5E1;
    text-align: center;
    margin-top: 4px;
    font-style: italic;
  }

  /* ==========================================================================
     STRUCTURED DECODER TABLES
     ========================================================================== */
  table.decoder-table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 12px 0;
    font-size: 8.5pt;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  table.decoder-table th {
    background-color: #1E293B;
    color: #FFFFFF;
    text-align: left;
    padding: 6px 8px;
    font-weight: 700;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  table.decoder-table td {
    padding: 6px 8px;
    border-bottom: 1px solid #E2E8F0;
    vertical-align: top;
  }
  table.decoder-table tr:nth-child(even) td {
    background-color: #F8FAFC;
  }
  .symbol-tag {
    font-family: "Courier New", Courier, monospace;
    font-weight: 800;
    background-color: #EFF6FF;
    color: #1D4ED8;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #BFDBFE;
    display: inline-block;
  }

  /* ==========================================================================
     IMAGE CONTAINERS
     ========================================================================== */
  .figure-container {
    text-align: center;
    margin: 10px 0 14px 0;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .figure-container img {
    max-width: 98%;
    height: auto;
    border-radius: 6px;
    border: 1px solid #E2E8F0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .figure-caption {
    font-size: 8pt;
    color: #475569;
    font-weight: 700;
    margin-top: 5px;
  }

  /* ==========================================================================
     COVER PAGE STYLING
     ========================================================================== */
  .cover-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 10px;
    page-break-after: always;
  }
  .cover-badge {
    display: inline-block;
    background-color: #1E293B;
    color: #38BDF8;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 8.5pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 16px;
  }
  .cover-title {
    font-size: 28pt;
    font-weight: 900;
    color: #0F172A;
    line-height: 1.15;
    margin-bottom: 8px;
    border: none;
    padding: 0;
  }
  .cover-subtitle {
    font-size: 13pt;
    color: #2563EB;
    font-weight: 600;
    margin-bottom: 24px;
    line-height: 1.4;
  }
  .cover-summary {
    background-color: #F8FAFC;
    border-left: 6px solid #2563EB;
    padding: 16px 20px;
    border-radius: 6px;
    font-size: 10pt;
    line-height: 1.6;
    color: #334155;
    margin-bottom: 30px;
  }
  .cover-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 30px;
  }
  .cover-stat-box {
    background: #FFFFFF;
    border: 1.5px solid #E2E8F0;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
  }
  .cover-stat-num {
    font-size: 16pt;
    font-weight: 900;
    color: #0F172A;
  }
  .cover-stat-label {
    font-size: 7.5pt;
    color: #64748B;
    font-weight: 700;
    text-transform: uppercase;
    margin-top: 4px;
  }
  .cover-footer {
    border-top: 2px solid #E2E8F0;
    padding-top: 14px;
    display: flex;
    justify-content: space-between;
    font-size: 8.5pt;
    color: #64748B;
  }
</style>
</head>
<body>

<!-- ==========================================================================
     PAGE 1: COVER PAGE
     ========================================================================== -->
<div class="cover-container">
  <div>
    <div class="cover-badge">Executive Engineering & Science Blueprint</div>
    <div class="cover-title">THE DEFINITIVE GUIDE TO MEDIA MIX MODELING (MMM)</div>
    <div class="cover-subtitle">From Everyday Intuition to Econometric Equations & Profit-Maximizing Budget Allocation</div>

    <div class="cover-summary">
      <strong>Executive Briefing:</strong> In an era of strict privacy regulations (GDPR, CCPA), Apple's App Tracking Transparency (ATT), and the end of third-party cookies, traditional "last-click" digital tracking has collapsed. Marketing Mix Modeling (MMM) has emerged as the global standard for enterprise measurement.<br><br>
      This manual bridges the gap between <strong>rigorous mathematical econometrics</strong> (Google Meridian, Meta Robyn, and PyMC-Marketing architectures) and <strong>effortless business intuition</strong>. Every mathematical equation is paired with a plain-English translation table, an everyday analogy a 16-year-old can explain, and direct guidance on how to allocate marketing millions without burning cash.
    </div>

    <div class="cover-grid">
      <div class="cover-stat-box">
        <div class="cover-stat-num">100%</div>
        <div class="cover-stat-label">Privacy-Safe (Zero Cookies/IDFA)</div>
      </div>
      <div class="cover-stat-box">
        <div class="cover-stat-num">+15% to +25%</div>
        <div class="cover-stat-label">Average Profit Lift via SLSQP</div>
      </div>
      <div class="cover-stat-box">
        <div class="cover-stat-num">Google & Meta</div>
        <div class="cover-stat-label">Production Framework Standard</div>
      </div>
    </div>
  </div>

  <div class="cover-footer">
    <div><strong>Target Audience:</strong> CMOs, CFOs, Data Scientists, Marketing Directors</div>
    <div><strong>Reference Architectures:</strong> Google Meridian (2026) • Meta Robyn • PyMC-Marketing</div>
  </div>
</div>

<!-- ==========================================================================
     PAGE 2: EXECUTIVE SUMMARY & THE ATTRIBUTION TRAP
     ========================================================================== -->
<div class="page-break">
  <h1>1. The Attribution Crisis & The Soccer Team Analogy</h1>

  <h2>The Fatal Flaw of Modern Digital Tracking</h2>
  <p>
    For the past decade, digital marketers relied on "Click Attribution." If a customer clicked a Google Search ad before buying a $200 jacket, Google claimed 100% of the credit. But ask yourself: <em>Did that search ad single-handedly convince the customer?</em> Or did they watch 3 TV commercials last month, see 5 TikTok reviews from influencers, and walk past a billboard downtown before finally searching for the brand name?
  </p>

  <div class="card card-intuition">
    <div class="card-intuition-title">⚽ The 16-Year-Old Explanation: The Soccer Striker Trap</div>
    <p>
      Imagine a soccer match. The defender intercepts the ball, passes it to the midfielder, who dribbles past three opponents and serves an inch-perfect cross right in front of the goal. The striker simply taps the ball into the net.
    </p>
    <p>
      If your scoreboard software only recorded <strong>"who touched the ball last"</strong>, it would say: <em>"The striker did 100% of the work! The midfielders and defenders did 0%!"</em> If a foolish team manager believed that, they would fire all the defenders and hire 11 strikers. In their very next match, they would lose 10-0.
    </p>
    <p>
      <strong>Last-Click Attribution is that foolish manager.</strong> It fires TV and brand advertising because Google Search tapped the ball in. <strong>Media Mix Modeling (MMM) is the master coach</strong> who watches hundreds of games to calculate how much defense, midfield, and offense each contributed to winning.
    </p>
  </div>

  <div class="figure-container">
    <img src="images/figure1_attribution_decomposition.png" alt="Figure 1: Attribution Trap vs True MMM Decomposition">
    <div class="figure-caption">Figure 1: The Last-Click Fallacy (Left) vs. True Econometric Decomposition via MMM (Right).</div>
  </div>

  <div class="card card-business">
    <div class="card-business-title">💼 Business Bottom Line: Why CFOs Demand MMM</div>
    <p>
      Platform dashboards (Facebook Ads Manager, Google Ads) routinely suffer from <strong>"Attribution Inflation"</strong>. If you add up the sales claimed by Google, Facebook, and TikTok dashboards, they often sum to 200% to 300% of the company's real bank deposits! MMM solves this because it calibrates against total actual top-line revenue—it is physically impossible for MMM to credit more dollars than the company actually earned.
    </p>
  </div>
</div>

<!-- ==========================================================================
     PAGE 3: THE MASTER ECONOMETRIC MMM EQUATION
     ========================================================================== -->
<div class="page-break">
  <h1>2. The Master Econometric Equation</h1>

  <p>
    At its scientific core, a Media Mix Model is an econometric decomposition. It states that total sales on any given day or week is the sum of organic brand strength, trend, seasonal waves, non-linear advertising effects, and economic controls.
  </p>

  <div class="formula-box">
    <div class="formula-label">The Grand Unified MMM Formulation</div>
    <div class="formula-display">
      <span class="hl-sales">Sales(t)</span> = 
      <span class="hl-base">Baseline(t)</span> + 
      <span class="hl-media">∑ βₘ · Saturation(Adstock(Spendₘ(t)))</span> + 
      <span class="hl-control">∑ γₖ · Controlₖ(t)</span> + 
      <span class="hl-noise">Error(t)</span>
    </div>
    <div class="formula-subtitle">Mathematical foundation utilized by Google Meridian, Meta Robyn, and PyMC-Marketing</div>
  </div>

  <h2>Symbol-by-Symbol Mathematical Translation Table</h2>
  <table class="decoder-table">
    <thead>
      <tr>
        <th style="width: 15%;">Formula Term</th>
        <th style="width: 25%;">Formal Math Definition</th>
        <th style="width: 35%;">Plain-English Meaning</th>
        <th style="width: 25%;">Real-World Example</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="symbol-tag">Sales(t)</span></td>
        <td>Dependent Variable ($Y_t$)</td>
        <td>The total KPI you care about at week $t$.</td>
        <td>Weekly Revenue ($150,000) or Units Sold.</td>
      </tr>
      <tr>
        <td><span class="symbol-tag">Baseline(t)</span></td>
        <td>Unobserved Organic Intercept</td>
        <td>Sales that would occur even with $0 advertising.</td>
        <td>Brand loyalty, word of mouth, repeat subscribers.</td>
      </tr>
      <tr>
        <td><span class="symbol-tag">Spendₘ(t)</span></td>
        <td>Raw Media Input ($X_{m,t}$)</td>
        <td>Dollars or impressions deployed on channel $m$.</td>
        <td>$25,000 spent on Meta Instagram Ads in Week 14.</td>
      </tr>
      <tr>
        <td><span class="symbol-tag">Adstock(·)</span></td>
        <td>Memory / Carryover Transformation</td>
        <td>How advertising echoes into future weeks.</td>
        <td>Seeing a billboard on Monday and buying on Friday.</td>
      </tr>
      <tr>
        <td><span class="symbol-tag">Saturation(·)</span></td>
        <td>Non-Linear Diminishing Returns</td>
        <td>Mathematical curve proving more spend yields less lift.</td>
        <td>The 10th pizza slice brings less joy than the 1st.</td>
      </tr>
      <tr>
        <td><span class="symbol-tag">βₘ</span></td>
        <td>Media Channel Impact Coefficient</td>
        <td>Strictly non-negative scale factor ($\beta_m \ge 0$).</td>
        <td>Direct conversion power of that channel.</td>
      </tr>
      <tr>
        <td><span class="symbol-tag">Controlₖ(t)</span></td>
        <td>Exogenous Covariates ($Z_{k,t}$)</td>
        <td>Outside world events that impact sales.</td>
        <td>Macro inflation, competitor sales, holidays, price.</td>
      </tr>
      <tr>
        <td><span class="symbol-tag">Error(t)</span></td>
        <td>Gaussian Residual ($\epsilon_t \sim \mathcal{N}(0, \sigma^2)$)</td>
        <td>Unexplained random variation or noise.</td>
        <td>A sudden local storm or random viral post.</td>
      </tr>
    </tbody>
  </table>

  <div class="card card-intuition">
    <div class="card-intuition-title">🏊 The 16-Year-Old Explanation: The Swimming Pool Water Level</div>
    <p>
      Think of your weekly sales like the water depth in a giant backyard swimming pool:
    </p>
    <ul>
      <li><strong>Baseline:</strong> The natural water already in the pool that stays there even if no one turns on a hose.</li>
      <li><strong>Seasonality:</strong> Natural summer rains that raise the water level without you doing anything.</li>
      <li><strong>Media Channels (Adstock & Saturation):</strong> The three garden hoses (TV, Social, Search) you turn on to pump extra water into the pool.</li>
      <li><strong>Controls:</strong> A hot sunny drought that evaporates water (competitor running a 50% discount).</li>
    </ul>
    <p>
      MMM measures the water level every week and statistically calculates exactly how many gallons came from the rain, how many from the pool's base, and how many gallons each garden hose added.
    </p>
  </div>
</div>

<!-- ==========================================================================
     PAGE 4: ADSTOCK & CARRYOVER EFFECTS
     ========================================================================== -->
<div class="page-break">
  <h1>3. Adstock: The "Memory" of Advertising</h1>

  <p>
    Advertising does not disappear the moment an ad finishes airing. If an ad runs on Sunday evening, a customer might recall it while shopping on Wednesday. This lingering carryover effect is termed <strong>Adstock</strong>.
  </p>

  <div class="formula-box">
    <div class="formula-label">Formula A: Classic Geometric Adstock (Recursive)</div>
    <div class="formula-display">
      <span class="hl-sales">Adstock(t)</span> = 
      <span class="hl-media">Spend(t)</span> + 
      <span class="hl-base">α · Adstock(t - 1)</span>
    </div>
    <div class="formula-subtitle">Parameter: α ∈ [0, 1) represents the memory retention rate per time period</div>
  </div>

  <table class="decoder-table">
    <thead>
      <tr>
        <th style="width: 15%;">Symbol</th>
        <th style="width: 25%;">Formal Math Term</th>
        <th style="width: 35%;">Plain-English Meaning</th>
        <th style="width: 25%;">Typical Benchmark Values</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="symbol-tag">α (Alpha)</span></td>
        <td>Decay Rate / Retention Parameter</td>
        <td>Percentage of marketing pressure that survives into next week.</td>
        <td>Search: 0.10 - 0.20<br>Social: 0.30 - 0.50<br>TV/Video: 0.60 - 0.85</td>
      </tr>
      <tr>
        <td><span class="symbol-tag">Half-Life</span></td>
        <td>$T_{1/2} = \frac{\ln(0.5)}{\ln(\alpha)}$</td>
        <td>Number of weeks until 50% of the ad's impact has evaporated.</td>
        <td>If $\alpha = 0.50$, Half-Life = 1.0 week.<br>If $\alpha = 0.80$, Half-Life = 3.1 weeks.</td>
      </tr>
      <tr>
        <td><span class="symbol-tag">L_max</span></td>
        <td>Finite Memory Cutoff</td>
        <td>Maximum number of lookback weeks computed.</td>
        <td>Usually 4 to 12 weeks.</td>
      </tr>
    </tbody>
  </table>

  <div class="card card-intuition">
    <div class="card-intuition-title">🎵 The 16-Year-Old Explanation: The "Earworm" Song on TikTok</div>
    <p>
      When a super catchy song pops up on your TikTok feed on Monday:
    </p>
    <ul>
      <li>On <strong>Monday</strong>, it's 100% stuck in your head.</li>
      <li>On <strong>Tuesday</strong>, you're still humming the chorus (80% memory).</li>
      <li>By <strong>Thursday</strong>, you still remember the beat (40% memory).</li>
      <li>By <strong>next Sunday</strong>, you only faintly remember it unless you hear it again.</li>
    </ul>
    <p>
      A direct search ad is like someone shouting a discount code at you—if you don't buy immediately, you forget it ($\alpha = 0.10$). A high-production TV commercial is an earworm song that stays in your head for weeks ($\alpha = 0.75$).
    </p>
  </div>

  <div class="figure-container">
    <img src="images/figure2_adstock_carryover.png" alt="Figure 2: Adstock Decay & Build-Up">
    <div class="figure-caption">Figure 2: Single Impulse Decay by Channel (Left) vs. Cumulative Marketing Pressure Build-Up (Right).</div>
  </div>

  <div class="card card-business">
    <div class="card-business-title">💼 Business Bottom Line: Flighting vs. Continuous Drip</div>
    <p>
      If your brand's adstock is high ($\alpha > 0.70$), you do not need to spend money every single week. You can use <strong>"Pulsing / Flighting"</strong> (spend heavy for 2 weeks, pause for 2 weeks). Your sales will ride the adstock wave, saving 20% to 30% of your annual media budget!
    </p>
  </div>
</div>

<!-- ==========================================================================
     PAGE 5: DIMINISHING RETURNS & HILL SATURATION
     ========================================================================== -->
<div class="page-break">
  <h1>4. Diminishing Returns & The Hill Saturation Function</h1>

  <p>
    The most dangerous assumption in marketing is that ad response is linear. Spending $100,000 does <em>never</em> produce 10 times the sales of $10,000. Why? Because you saturate the market, spam the same users, and exhaust high-intent buyers.
  </p>

  <div class="formula-box">
    <div class="formula-label">The Pharmacology-Inspired Hill Saturation Equation</div>
    <div class="formula-display">
      <span class="hl-sales">Response(A)</span> = 
      <span class="hl-media">Aˢ</span> / 
      <span class="hl-base">(Aˢ + Kˢ)</span>
    </div>
    <div class="formula-subtitle">Transforms adstocked spend A into a normalized 0.0 to 1.0 saturation coefficient</div>
  </div>

  <table class="decoder-table">
    <thead>
      <tr>
        <th style="width: 15%;">Symbol</th>
        <th style="width: 25%;">Formal Math Term</th>
        <th style="width: 35%;">Plain-English Meaning</th>
        <th style="width: 25%;">Decision Rule</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="symbol-tag">A</span></td>
        <td>Adstocked Media Pressure</td>
        <td>The effective marketing volume active in the market at week $t$.</td>
        <td>Input to the curve.</td>
      </tr>
      <tr>
        <td><span class="symbol-tag">K</span></td>
        <td>Half-Saturation Constant ($EC_{50}$)</td>
        <td>The exact spend level where the channel reaches 50% of its maximum power.</td>
        <td>If spend $\ll K$, you are under-spending.<br>If spend $\gg K$, you are saturating.</td>
      </tr>
      <tr>
        <td><span class="symbol-tag">S</span></td>
        <td>Hill Slope / Shape Parameter</td>
        <td>Controls the curvature and steepness of the response curve.</td>
        <td>$S \le 1.0$: Immediate concave decay.<br>$S > 1.0$: S-Curve (requires priming).</td>
      </tr>
      <tr>
        <td><span class="symbol-tag">mROAS</span></td>
        <td>Marginal Return on Ad Spend: $\frac{\partial Y}{\partial X}$</td>
        <td>How much additional revenue the <strong>next single dollar</strong> will produce.</td>
        <td>Must remain $> 1.0$ (otherwise losing money).</td>
      </tr>
    </tbody>
  </table>

  <div class="card card-intuition">
    <div class="card-intuition-title">🍕 The 16-Year-Old Explanation: Eating Pizza Slices</div>
    <p>
      Imagine you just finished a 3-hour basketball practice and you are starving:
    </p>
    <ul>
      <li><strong>Slice 1:</strong> Tastes heavenly. 10/10 satisfaction ($1.00 spent makes $5.00 sales).</li>
      <li><strong>Slice 2 & 3:</strong> Great, still very hungry ($1.00 spent makes $3.50 sales).</li>
      <li><strong>Slice 5:</strong> You are full. You eat it just because it's there ($1.00 spent makes $1.10 sales).</li>
      <li><strong>Slice 8:</strong> You feel sick. Eating more makes you nauseous ($1.00 spent makes $0.20 sales).</li>
    </ul>
    <p>
      <strong>Many marketing teams are force-feeding themselves Slice #8 every single day.</strong> They boast that their overall "average" ROAS looks okay, while in reality, their last $20,000 spent is producing almost zero new revenue.
    </p>
  </div>

  <div class="figure-container">
    <img src="images/figure3_hill_saturation.png" alt="Figure 3: Hill Saturation Curve & Marginal ROAS Collapse">
    <div class="figure-caption">Figure 3: Total Response S-Curve (Top) vs. Marginal ROAS Collapse (Bottom).</div>
  </div>

  <div class="card card-warning">
    <div class="card-warning-title">⚠️ The Blended ROAS Trap (Why Marketers Get Fired)</div>
    <p>
      A marketing agency tells the CEO: <em>"Our Facebook Ads have an average ROAS of 3.0x! Let's double the budget!"</em><br>
      The CEO doubles the budget from $50k to $100k, but sales only go up by 5%. Why? Because the <strong>average</strong> was 3.0x, but the <strong>marginal ROAS</strong> on the next $50k was only 0.40x. Every single extra dollar spent lost 60 cents! MMM exposes this curve instantly.
    </p>
  </div>
</div>

<!-- ==========================================================================
     PAGE 6: EXTERNAL CONTROLS & BASELINE DECOMPOSITION
     ========================================================================== -->
<div class="page-break">
  <h1>5. Baselining, Seasonality & External Economic Controls</h1>

  <p>
    To calculate true advertising effectiveness, you must first strip away everything that is <strong>NOT</strong> caused by advertising. If sales spike in December, is your marketing team a bunch of geniuses, or is it just Christmas?
  </p>

  <div class="formula-box">
    <div class="formula-label">Baseline & External Shocks Formulation</div>
    <div class="formula-display">
      <span class="hl-base">Base(t)</span> = 
      <span class="hl-base">β₀ + Trend · t</span> + 
      <span class="hl-control">∑ [s₁ · sin(2πt/52) + s₂ · cos(2πt/52)]</span> + 
      <span class="hl-control">γ₁ · Price(t) + γ₂ · CompetitorPromo(t)</span>
    </div>
    <div class="formula-subtitle">Decomposes time series into underlying linear trend, annual Fourier seasonality, and economic controls</div>
  </div>

  <h2>Why Control Variables Are Non-Negotiable</h2>
  <table class="decoder-table">
    <thead>
      <tr>
        <th style="width: 20%;">Variable Category</th>
        <th style="width: 30%;">Mathematical Implementation</th>
        <th style="width: 50%;">Real-World Business Impact</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Organic Baseline</strong></td>
        <td>Unchanging intercept $\beta_0$ or time-varying spline.</td>
        <td>Sales driven by brand equity, physical store presence, and existing customer base.</td>
      </tr>
      <tr>
        <td><strong>Annual Seasonality</strong></td>
        <td>Fourier harmonics: $\sin(2\pi \cdot t / 52)$, $\cos(2\pi \cdot t / 52)$.</td>
        <td>Smoothly captures recurring holiday spikes (Q4 shopping, summer dips) without overfitting.</td>
      </tr>
      <tr>
        <td><strong>Pricing & Discounts</strong></td>
        <td>Continuous price index variable.</td>
        <td>Isolates whether sales increased because of a great ad campaign or because you slashed prices by 30%.</td>
      </tr>
      <tr>
        <td><strong>Competitor Activity</strong></td>
        <td>Binary dummy or competitor spend index.</td>
        <td>Explains random drops in your sales when your rival launches a massive Super Bowl campaign.</td>
      </tr>
      <tr>
        <td><strong>Macroeconomics</strong></td>
        <td>Consumer Price Index (CPI), Unemployment rate.</td>
        <td>Accounts for broader consumer spending power drops during recessions.</td>
      </tr>
    </tbody>
  </table>

  <div class="card card-intuition">
    <div class="card-intuition-title">🍦 The 16-Year-Old Explanation: Selling Ice Cream on the Boardwalk</div>
    <p>
      Imagine you sell ice cream on the beach:
    </p>
    <ul>
      <li>In <strong>July</strong> (sunny, 90°F), you sell 1,000 ice creams a day even if you do zero advertising.</li>
      <li>In <strong>January</strong> (freezing snowstorm), you sell 10 ice creams a day even if you spend $10,000 on ads.</li>
    </ul>
    <p>
      If your model doesn't account for temperature (Seasonality/Control), it will falsely conclude that your ads are pure magic in July and completely useless in January! MMM removes the "weather effect" so you see the true causal impact of your ad dollars.
    </p>
  </div>
</div>

<!-- ==========================================================================
     PAGE 7: STATISTICAL CHALLENGES & CALIBRATION
     ========================================================================== -->
<div class="page-break">
  <h1>6. Overcoming Statistical Pitfalls: Non-Negative Constraints & Calibration</h1>

  <h2>The Two Cardinal Sins of Novice MMM</h2>
  <p>
    When inexperienced analysts run simple regressions (like Ordinary Least Squares in Excel or basic Python statsmodels), they almost always run into two fatal traps:
  </p>

  <div class="card card-warning">
    <div class="card-warning-title">🚨 Trap 1: The "Negative Coefficient" Absurdity</div>
    <p>
      <strong>The Problem:</strong> A raw regression outputs $\beta_{\text{TV}} = -1.45$. The math claims that every time you air a TV commercial, customers get offended and stop buying your products!<br>
      <strong>The Cause:</strong> Multicollinearity. Brands spend heavily on TV, Social, and Search in the exact same weeks (e.g., Black Friday). The algorithm cannot tell which one drove the sales, so it gives one channel a huge positive number and artificially penalizes another with a negative number.<br>
      <strong>The Solution: Non-Negative Least Squares (NNLS)</strong>. We enforce strict mathematical boundary conditions: $\beta_m \ge 0$. Advertising can have diminishing returns, but in a standard environment, it cannot destroy baseline revenue.
    </p>
  </div>

  <h2>Modern Calibration: Triangulating with Experiments (Google Meridian / Meta Robyn)</h2>
  <p>
    Pure observational modeling only sees <em>correlation</em>. To prove <em>causation</em>, the gold standard in modern data science is <strong>Triangulation</strong>: combining observational MMM with <strong>Randomized Controlled Experiments (Geo-Lift Tests)</strong>.
  </p>

  <div class="figure-container">
    <img src="images/figure5_enterprise_architecture.png" alt="Figure 5: Enterprise MMM Architecture">
    <div class="figure-caption">Figure 5: End-to-End Enterprise Architecture: Ingestion, Transformation, Bayesian Prior Calibration, and Optimization.</div>
  </div>

  <table class="decoder-table">
    <thead>
      <tr>
        <th style="width: 25%;">Calibration Method</th>
        <th style="width: 35%;">How It Works</th>
        <th style="width: 40%;">How MMM Uses It</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Geo-Lift Test (RCT)</strong></td>
        <td>Turn off ads in 10 test states (e.g., Ohio, Texas) while keeping them running in 10 matched control states.</td>
        <td>Measures true causal dollar lift with 95% statistical confidence.</td>
      </tr>
      <tr>
        <td><strong>Bayesian Prior Injection</strong></td>
        <td>Inform the MMM using Gaussian distributions centered around the experimental lift result: $\beta_m \sim \mathcal{N}(\mu_{\text{exp}}, \sigma_{\text{exp}}^2)$.</td>
        <td>Prevents the model from hallucinating unreasonable ROAS numbers that contradict real-world experiments.</td>
      </tr>
      <tr>
        <td><strong>Ghost-Ad Holdouts</strong></td>
        <td>Digital platforms withhold ads from a randomized 5% control group of users.</td>
        <td>Validates digital search/social incrementality directly against organic behavior.</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- ==========================================================================
     PAGE 8: BUDGET OPTIMIZATION & SCENARIO PLANNING
     ========================================================================== -->
<div class="page-break">
  <h1>7. Mathematical Budget Optimization</h1>

  <p>
    Fitting an MMM is only half the battle. The true business value comes when you use the learned parameters to answer: <strong>"How should we allocate our $100,000 budget next month to maximize total revenue?"</strong>
  </p>

  <div class="formula-box">
    <div class="formula-label">Non-Linear Constrained Optimization Problem</div>
    <div class="formula-display">
      max [ ∑ βₘ · Saturation(Bₘ) ] &nbsp;&nbsp; subject to &nbsp;&nbsp; ∑ Bₘ = Total_Budget
    </div>
    <div class="formula-subtitle">Solved via Sequential Least Squares Programming (SLSQP) with Karush-Kuhn-Tucker (KKT) optimality</div>
  </div>

  <h2>The Equi-Marginal Principle</h2>
  <p>
    In economic theory, your budget is optimally allocated when the <strong>Marginal ROAS is identical across all active channels</strong>:
  </p>
  <div style="text-align: center; font-size: 11pt; font-weight: 700; color: #1E3A8A; margin: 8px 0;">
    mROAS<sub>TV</sub> = mROAS<sub>Social</sub> = mROAS<sub>Search</sub> = λ
  </div>
  <p>
    If TV is giving you a marginal return of $3.50 on the next dollar, while Social is only giving you $1.20, every single dollar you move from Social to TV generates $2.30 of pure free profit! You keep shifting money until their marginal returns equalize.
  </p>

  <div class="figure-container">
    <img src="images/figure4_budget_optimization.png" alt="Figure 4: Budget Optimization Results">
    <div class="figure-caption">Figure 4: Before vs. After Budget Re-allocation (Left) and Resulting Incremental Revenue Lift (Right).</div>
  </div>

  <div class="card card-business">
    <div class="card-business-title">💰 Case Study Result: +$42,000 Free Revenue</div>
    <p>
      In the simulation shown above, the company spent <strong>$100,000</strong> per month:
    </p>
    <ul>
      <li><strong>Old Allocation:</strong> Heavy over-spending on TV ($45k) pushed it deep into the flat saturation zone. Search was under-funded ($20k). Total revenue generated: <strong>$184,000</strong>.</li>
      <li><strong>MMM Optimal Allocation:</strong> Shifted $20k out of saturated TV and re-allocated it into high-performing Search. Total revenue generated: <strong>$226,000</strong>.</li>
      <li><strong>Net Business Impact:</strong> <strong>+$42,000 in incremental revenue (+22.8% lift)</strong> without increasing the media budget by a single penny!</li>
    </ul>
  </div>
</div>

<!-- ==========================================================================
     PAGE 9: EXECUTIVE CHECKLIST & IMPLEMENTATION ROADMAP
     ========================================================================== -->
<div class="page-break">
  <h1>8. Executive Checklist & Implementation Roadmap</h1>

  <h2>Step-by-Step Production Roadmap</h2>
  <table class="decoder-table">
    <thead>
      <tr>
        <th style="width: 15%;">Phase</th>
        <th style="width: 30%;">Key Milestones</th>
        <th style="width: 55%;">Verification & Quality Gate</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Phase 1: Data Audit</strong></td>
        <td>Collect 2–3 years of weekly data across spend, impressions, baseline sales, pricing, and macro events.</td>
        <td>Check for data gaps, missing weeks, or currency mismatches. Ensure at least 104 weekly observations.</td>
      </tr>
      <tr>
        <td><strong>Phase 2: Feature Engineering</strong></td>
        <td>Compute Geometric/Weibull adstock curves and Fourier seasonality sin/cos terms.</td>
        <td>Ensure adstock search parameters span direct response ($\alpha \approx 0.1$) to TV ($\alpha \approx 0.8$).</td>
      </tr>
      <tr>
        <td><strong>Phase 3: Model Fitting</strong></td>
        <td>Execute non-linear optimization with Non-Negative Least Squares (NNLS) for media coefficients.</td>
        <td>Confirm all $\beta_m \ge 0$. Ensure holdout test Mean Absolute Percentage Error (MAPE) is below 10%.</td>
      </tr>
      <tr>
        <td><strong>Phase 4: Experimental Triangulation</strong></td>
        <td>Calibrate model predictions against at least one real-world Geo-Lift or Holdout test.</td>
        <td>Verify that model-estimated channel ROAS falls within the 95% confidence interval of the lift test.</td>
      </tr>
      <tr>
        <td><strong>Phase 5: Budget Optimization</strong></td>
        <td>Run SLSQP optimizer to produce the next quarter's recommended spend distribution.</td>
        <td>Add min/max guardrails (e.g., no channel can change by more than ±30% in one quarter).</td>
      </tr>
    </tbody>
  </table>

  <h2>The 10-Point Pre-Flight Verification Checklist</h2>
  <div class="card card-intuition">
    <div class="card-intuition-title">✅ The MMM Auditor's Checklist</div>
    <ul style="margin: 0; padding-left: 20px;">
      <li><strong>1. No Cookies Used:</strong> Is the model 100% compliant with privacy regulations (GDPR/CCPA/ATT)?</li>
      <li><strong>2. Non-Negative Constraints:</strong> Are all media betas strictly non-negative ($\beta \ge 0$)?</li>
      <li><strong>3. Diminishing Returns Included:</strong> Does every channel use a non-linear saturation curve (Hill/Sigmoid)?</li>
      <li><strong>4. Organic Baseline Separated:</strong> Did the model calculate baseline sales without ads?</li>
      <li><strong>5. Seasonality Controlled:</strong> Are holidays and annual cycles modeled explicitly?</li>
      <li><strong>6. External Controls Included:</strong> Were pricing changes and promotions included in the covariates?</li>
      <li><strong>7. Holdout Validation:</strong> Was the model tested on out-of-sample data not used during training?</li>
      <li><strong>8. Marginal ROAS vs. Average ROAS:</strong> Did decisions rely on marginal curves rather than blended averages?</li>
      <li><strong>9. Spend Guardrails in Optimizer:</strong> Did the optimizer enforce realistic operational minimums and maximums?</li>
      <li><strong>10. Code Execution:</strong> Can the accompanying <code>mmm_engine.py</code> run end-to-end without errors?</li>
    </ul>
  </div>

  <div style="margin-top: 30px; text-align: center; border-top: 1px solid #CBD5E1; padding-top: 14px; font-size: 8pt; color: #64748B;">
    <strong>Document Reference:</strong> Local Disk D: • <code>D:\MediaMixModel\The_Definitive_Guide_to_Media_Mix_Modeling.pdf</code><br>
    Companion Production Script: <code>D:\MediaMixModel\mmm_engine.py</code> • Generated for Executive Presentation & High-Quality Print
  </div>
</div>

</body>
</html>
"""

# Write HTML file
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML written to {html_path}")

# Run Chrome Headless to compile to PDF
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
cmd = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--run-all-compositor-stages-before-draw",
    f"--print-to-pdf={pdf_path}",
    "--no-pdf-header-footer",
    html_path
]

print("Compiling PDF with Chrome Headless...")
result = subprocess.run(cmd, capture_output=True, text=True)

if os.path.exists(pdf_path):
    size_kb = os.path.getsize(pdf_path) / 1024
    print(f"SUCCESS: PDF generated successfully at {pdf_path} ({size_kb:.1f} KB)")
else:
    print(f"ERROR: PDF was not generated. Details: {result.stderr}")
