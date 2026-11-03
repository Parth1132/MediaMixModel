"""
generate_charts.py
Generates high-resolution (300 DPI), publication-grade visual diagrams for the MMM Guide.
Now updated with horizontal wide aspect ratios for all 5 figures!
"""

import os
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches

output_dir = r"D:\MediaMixModel\images"
os.makedirs(output_dir, exist_ok=True)

plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['axes.edgecolor'] = '#CBD5E1'
plt.rcParams['axes.linewidth'] = 1.0

# -----------------------------------------------------------------------------
# FIGURE 1: The Last-Click Attribution Trap vs. True MMM Decomposition
# -----------------------------------------------------------------------------
def create_figure1():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5.0), dpi=300)

    # Subplot 1: The Last-Click Fallacy
    channels = ['Brand Search', 'Social Ads', 'YouTube Video', 'TV Ads', 'Word-of-Mouth']
    last_click_shares = [78, 14, 5, 0, 3]
    colors1 = ['#2563EB', '#38BDF8', '#94A3B8', '#CBD5E1', '#E2E8F0']

    bars = ax1.bar(channels, last_click_shares, color=colors1, width=0.55, edgecolor='#1E293B', linewidth=1)
    ax1.set_title("The Flawed 'Last-Click' Illusion\n(What Google Analytics / Dashboards Report)", 
                  fontsize=11.5, fontweight='bold', color='#0F172A', pad=12)
    ax1.set_ylabel("% of Sales Credited", fontsize=9.5, fontweight='bold', color='#334155')
    ax1.set_ylim(0, 100)
    ax1.grid(axis='y', linestyle='--', alpha=0.5)

    for bar in bars:
        yval = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2.0, yval + 2, f"{int(yval)}%", 
                 ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#1E293B')

    ax1.text(0.5, 0.68, "TRAP:\nSearch gets all credit,\nignoring the TV & Video\nthat created the demand!", 
             transform=ax1.transAxes, ha='center', va='center', 
             bbox=dict(boxstyle='round,pad=0.7', facecolor='#FEF2F2', edgecolor='#EF4444', linewidth=1.5),
             fontsize=9, fontweight='bold', color='#991B1B')

    # Subplot 2: True Econometric MMM Decomposition
    weeks = np.arange(1, 13)
    baseline = np.full_like(weeks, 40)
    tv = np.array([5, 12, 18, 15, 10, 8, 7, 6, 5, 5, 4, 4])
    social = np.array([8, 10, 12, 14, 15, 14, 12, 11, 10, 9, 8, 8])
    search = np.array([12, 15, 18, 20, 22, 20, 18, 17, 16, 15, 14, 14])

    ax2.bar(weeks, baseline, label='Organic Baseline (Brand & Direct)', color='#64748B', width=0.6)
    ax2.bar(weeks, tv, bottom=baseline, label='TV Incremental Lift', color='#8B5CF6', width=0.6)
    ax2.bar(weeks, social, bottom=baseline+tv, label='Social Ads Lift', color='#EC4899', width=0.6)
    ax2.bar(weeks, search, bottom=baseline+tv+social, label='Search Ads Lift', color='#2563EB', width=0.6)

    ax2.set_title("The True Econometric MMM Reality\n(Total Revenue Decomposed by True Causal Drivers)", 
                  fontsize=11.5, fontweight='bold', color='#0F172A', pad=12)
    ax2.set_xlabel("Time (Weeks)", fontsize=9.5, fontweight='bold', color='#334155')
    ax2.set_ylabel("Weekly Sales ($ in Thousands)", fontsize=9.5, fontweight='bold', color='#334155')
    ax2.set_ylim(0, 110)
    ax2.legend(loc='upper right', framealpha=0.9, fontsize=8)
    ax2.grid(axis='y', linestyle='--', alpha=0.5)

    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, "figure1_attribution_decomposition.png"), dpi=300)
    plt.close(fig)
    print("Created Figure 1")

# -----------------------------------------------------------------------------
# FIGURE 2: Adstock & Carryover Effect (The Memory Decay)
# -----------------------------------------------------------------------------
def create_figure2():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5.0), dpi=300)

    # Subplot 1: Single Ad Impulse Decay
    weeks = np.arange(0, 9)
    search_decay = 10.0 * (0.15 ** weeks)
    social_decay = 10.0 * (0.45 ** weeks)
    tv_decay = 10.0 * (0.80 ** weeks)

    ax1.plot(weeks, tv_decay, marker='o', linewidth=2.5, color='#8B5CF6', label='TV / Brand (α = 0.80, Long-term)')
    ax1.plot(weeks, social_decay, marker='s', linewidth=2.5, color='#EC4899', label='Social Media Ads (α = 0.45, Moderate)')
    ax1.plot(weeks, search_decay, marker='^', linewidth=2.5, color='#2563EB', label='Paid Search (α = 0.15, Immediate)')

    ax1.set_title("Single Impulse Decay ($10,000 Spent in Week 0)", fontsize=11.5, fontweight='bold', color='#0F172A', pad=12)
    ax1.set_xlabel("Weeks Since Ad Aired", fontsize=9.5, fontweight='bold', color='#334155')
    ax1.set_ylabel("Effective Ad Pressure Remaining ($k)", fontsize=9.5, fontweight='bold', color='#334155')
    ax1.set_xticks(weeks)
    ax1.grid(True, linestyle='--', alpha=0.5)
    ax1.legend(loc='upper right', fontsize=8)

    ax1.annotate("Brand TV ad echoes\nfor over 6+ weeks!", xy=(4, tv_decay[4]), xytext=(4.5, 5.8),
                 arrowprops=dict(facecolor='#8B5CF6', shrink=0.08, width=1.5, headwidth=6),
                 fontsize=8.5, fontweight='bold', color='#6D28D9')

    # Subplot 2: Cumulative Build-up from Continuous Spending
    continuous_weeks = np.arange(1, 13)
    raw_weekly_spend = np.array([5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0], dtype=float)
    
    alpha = 0.6
    adstock_build = np.zeros(12)
    current = 0
    for i, sp in enumerate(raw_weekly_spend):
        current = sp + alpha * current
        adstock_build[i] = current

    ax2.bar(continuous_weeks, raw_weekly_spend, width=0.4, color='#CBD5E1', label='Raw Weekly Spend ($5k for 6 weeks, then $0)')
    ax2.plot(continuous_weeks, adstock_build, color='#059669', marker='D', linewidth=2.5, label='Effective Cumulative Adstock')

    ax2.set_title("Cumulative Adstock Build-Up & Lingering Hangover", fontsize=11.5, fontweight='bold', color='#0F172A', pad=12)
    ax2.set_xlabel("Week", fontsize=9.5, fontweight='bold', color='#334155')
    ax2.set_ylabel("Marketing Pressure in Market ($k)", fontsize=9.5, fontweight='bold', color='#334155')
    ax2.set_xticks(continuous_weeks)
    ax2.grid(True, linestyle='--', alpha=0.5)
    ax2.legend(loc='upper right', fontsize=8)

    ax2.annotate("Spend stops at W6,\nbut sales remain elevated!", xy=(7, adstock_build[6]), xytext=(7.5, 7.5),
                 arrowprops=dict(facecolor='#059669', shrink=0.08, width=1.5, headwidth=6),
                 fontsize=8.5, fontweight='bold', color='#047857')

    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, "figure2_adstock_carryover.png"), dpi=300)
    plt.close(fig)
    print("Created Figure 2")

# -----------------------------------------------------------------------------
# FIGURE 3: Diminishing Returns & The Hill Saturation S-Curve (NOW HORIZONTAL)
# -----------------------------------------------------------------------------
def create_figure3():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5.0), dpi=300)

    spend = np.linspace(0, 50, 500)
    K = 18.0
    S = 1.6
    max_rev = 80.0

    revenue = max_rev * (spend ** S) / (spend ** S + K ** S)
    marginal_roas = max_rev * (S * (K**S) * (np.maximum(spend, 1e-4)**(S - 1))) / ((spend**S + K**S)**2)

    # Subplot 1: Total Response Curve
    ax1.plot(spend, revenue, color='#1E40AF', linewidth=3, label='Total Generated Revenue ($k)')
    ax1.axvline(x=K, color='#DC2626', linestyle='--', linewidth=1.5, label=f'Half-Saturation Point (K = ${int(K)}k)')

    ax1.axvspan(0, 8, color='#FEF3C7', alpha=0.4, label='Zone 1: Initiation / Priming')
    ax1.axvspan(8, 26, color='#DCFCE7', alpha=0.4, label='Zone 2: Sweet Spot (High Profit)')
    ax1.axvspan(26, 50, color='#FEE2E2', alpha=0.4, label='Zone 3: Saturation & Fatigue')

    ax1.set_title("Total Revenue Response (Hill S-Curve)", fontsize=11.5, fontweight='bold', color='#0F172A', pad=12)
    ax1.set_xlabel("Weekly Channel Spend ($ in Thousands)", fontsize=9.5, fontweight='bold', color='#334155')
    ax1.set_ylabel("Total Generated Revenue ($k)", fontsize=9.5, fontweight='bold', color='#334155')
    ax1.grid(True, linestyle='--', alpha=0.5)
    ax1.legend(loc='lower right', fontsize=7.8)

    ax1.annotate("Curve flattens out!\nMore spend yields almost $0 extra.", xy=(40, revenue[400]), xytext=(27, 62),
                 arrowprops=dict(facecolor='#DC2626', shrink=0.08, width=1.5, headwidth=6),
                 fontsize=8.5, fontweight='bold', color='#B91C1C')

    # Subplot 2: Marginal ROAS (Derivative)
    ax2.plot(spend, marginal_roas, color='#D97706', linewidth=2.5, label='Marginal ROAS (Return on Next $1.00)')
    ax2.axhline(y=1.0, color='#991B1B', linestyle=':', linewidth=2, label='Breakeven ($1.00 Return per $1.00 Spend)')
    ax2.set_title("Marginal ROAS Collapse (The Next Dollar)", fontsize=11.5, fontweight='bold', color='#0F172A', pad=12)
    ax2.set_xlabel("Weekly Channel Spend ($ in Thousands)", fontsize=9.5, fontweight='bold', color='#334155')
    ax2.set_ylabel("Marginal Return ($ Revenue / $ Spend)", fontsize=9.5, fontweight='bold', color='#334155')
    ax2.grid(True, linestyle='--', alpha=0.5)
    ax2.legend(loc='upper right', fontsize=8)

    ax2.annotate("Stop spending here!\nBeyond this point,\nevery ad dollar loses money.", 
                 xy=(33, 1.0), xytext=(22, 2.2),
                 arrowprops=dict(facecolor='#991B1B', shrink=0.08, width=1.5, headwidth=6),
                 fontsize=8.5, fontweight='bold', color='#991B1B')

    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, "figure3_hill_saturation.png"), dpi=300)
    plt.close(fig)
    print("Created Figure 3 (Horizontal)")

# -----------------------------------------------------------------------------
# FIGURE 4: Budget Optimization & Re-allocation Frontier
# -----------------------------------------------------------------------------
def create_figure4():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5.0), dpi=300)

    channels = ['TV / Brand', 'Social Ads', 'Paid Search']
    current_spend = [45000, 35000, 20000]
    optimal_spend = [25000, 32000, 43000]
    total_budget = sum(current_spend)

    x = np.arange(len(channels))
    width = 0.32

    rects1 = ax1.bar(x - width/2, [s/1000 for s in current_spend], width, label='Current Allocation', color='#94A3B8', edgecolor='#334155')
    rects2 = ax1.bar(x + width/2, [s/1000 for s in optimal_spend], width, label='Model-Optimized Allocation', color='#10B981', edgecolor='#065F46')

    ax1.set_title(f"Budget Re-allocation (Total Flat Budget = ${total_budget/1000:.0f}k)", 
                  fontsize=11.5, fontweight='bold', color='#0F172A', pad=12)
    ax1.set_ylabel("Monthly Spend ($ in Thousands)", fontsize=9.5, fontweight='bold', color='#334155')
    ax1.set_xticks(x)
    ax1.set_xticklabels(channels, fontsize=9.5, fontweight='bold')
    ax1.legend(loc='upper right', fontsize=8.5)
    ax1.grid(axis='y', linestyle='--', alpha=0.5)

    # Subplot 2: Resulting Revenue Comparison
    scenarios = ['Current Allocation', 'Optimal Allocation']
    revenue_gen = [184000, 226000]
    rev_colors = ['#64748B', '#059669']

    bars = ax2.bar(scenarios, [r/1000 for r in revenue_gen], color=rev_colors, width=0.45, edgecolor='#0F172A')
    ax2.set_title("Incremental Revenue Output for Same $100k Spend", fontsize=11.5, fontweight='bold', color='#0F172A', pad=12)
    ax2.set_ylabel("Generated Revenue ($ in Thousands)", fontsize=9.5, fontweight='bold', color='#334155')
    ax2.set_ylim(0, 260)
    ax2.grid(axis='y', linestyle='--', alpha=0.5)

    for bar in bars:
        h = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2.0, h + 5, f"${int(h)}k", ha='center', va='bottom', fontsize=10, fontweight='bold')

    ax2.text(0.5, 0.40, "+$42,000 (+22.8%)\nAdditional Revenue\nWithout Spending an Extra Dime!",
             transform=ax2.transAxes, ha='center', va='center',
             bbox=dict(boxstyle='round,pad=0.7', facecolor='#ECFDF5', edgecolor='#10B981', linewidth=1.8),
             fontsize=9.5, fontweight='bold', color='#065F46')

    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, "figure4_budget_optimization.png"), dpi=300)
    plt.close(fig)
    print("Created Figure 4")

# -----------------------------------------------------------------------------
# FIGURE 5: Modern Enterprise MMM Architecture
# -----------------------------------------------------------------------------
def create_figure5():
    fig, ax = plt.subplots(figsize=(13, 5.0), dpi=300)
    ax.axis('off')
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)

    ax.text(50, 95, "Enterprise Marketing Mix Modeling Pipeline (Google Meridian / Meta Robyn Standard)",
            ha='center', va='center', fontsize=12, fontweight='bold', color='#0F172A')

    steps = [
        {"title": "1. Data Inputs", "color": "#EFF6FF", "border": "#3B82F6", "x": 4, "w": 16.5,
         "desc": "• Media Spends / Impr\n• Organic Baseline KPI\n• Macro CPI / Inflation\n• Seasonality & Holidays\n• Geo-level State DMA"},
        
        {"title": "2. Transforms", "color": "#F5F3FF", "border": "#8B5CF6", "x": 23, "w": 16.5,
         "desc": "• Geometric / Weibull\n  Adstock Carryover\n• Hill Saturation Curve\n• Non-linear Decay\n• Fourier Seasonality"},
        
        {"title": "3. Calibration", "color": "#FDF2F8", "border": "#EC4899", "x": 42, "w": 16.5,
         "desc": "• Geo-Lift Test Priors\n• Ghost-Ad Holdouts\n• Domain Knowledge\n• Multicollinearity Fix\n• Non-negative bounds"},
         
        {"title": "4. Model Engine", "color": "#FEF3C7", "border": "#D97706", "x": 61, "w": 16.5,
         "desc": "• MCMC / NUTS Sampler\n• Non-Negative Ridge\n• Time-Varying Spline\n• Holdout MAPE & R²\n• Causal Attribution"},
         
        {"title": "5. Optimization", "color": "#ECFDF5", "border": "#10B981", "x": 80, "w": 16.5,
         "desc": "• Marginal ROAS Curves\n• SLSQP Optimizer\n• Scenario Planner\n• Minimum / Max Guards\n• Budget Re-allocation"},
    ]

    for s in steps:
        rect = patches.FancyBboxPatch((s["x"], 16), s["w"], 68,
                                     boxstyle="round,pad=1.2",
                                     facecolor=s["color"],
                                     edgecolor=s["border"],
                                     linewidth=1.8)
        ax.add_patch(rect)
        ax.text(s["x"] + s["w"]/2, 77, s["title"], ha='center', va='center', fontsize=9, fontweight='bold', color='#0F172A')
        ax.plot([s["x"]+1, s["x"]+s["w"]-1], [72, 72], color=s["border"], linewidth=1.2)
        ax.text(s["x"] + 1.2, 44, s["desc"], ha='left', va='center', fontsize=7.8, color='#334155', linespacing=1.6)

    for i in range(len(steps)-1):
        x_start = steps[i]["x"] + steps[i]["w"] + 0.2
        x_end = steps[i+1]["x"] - 0.2
        ax.annotate('', xy=(x_end, 50), xytext=(x_start, 50),
                    arrowprops=dict(facecolor='#64748B', edgecolor='#475569', shrink=0.0, width=1.8, headwidth=6))

    ax.text(50, 7, "Privacy-Safe • Zero Cookies / IDFA Required • Statistically Calibrated with Geo Experiments",
            ha='center', va='center', fontsize=8.5, style='italic', color='#64748B')

    plt.tight_layout()
    fig.savefig(os.path.join(output_dir, "figure5_enterprise_architecture.png"), dpi=300)
    plt.close(fig)
    print("Created Figure 5 (Wide)")

if __name__ == "__main__":
    create_figure1()
    create_figure2()
    create_figure3()
    create_figure4()
    create_figure5()
    print("Regenerated all 5 figures with optimized horizontal dimensions.")
