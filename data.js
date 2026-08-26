// Auto-generated from waste_forecast.db + DAX logic
const WASTE_DATA = {
  "meta": {
    "generated": "2026-08-26",
    "source": "Fundamenta_All_Data.xlsx - All Data sheet",
    "records": 589,
    "barangays": [
      "Aurora",
      "Bagongon",
      "Gabi",
      "Lagab",
      "Mangayon",
      "Mapaca",
      "Maparat",
      "New Alegria",
      "Ngan",
      "Osme\u00f1a",
      "Poblacion",
      "San Jose",
      "San Miguel",
      "Siocon",
      "Tamia"
    ],
    "waste_types": [
      "Biodegradable",
      "Recyclable",
      "Recyclable/Residual",
      "Residual",
      "Residual/Biodegradable",
      "Special",
      "Unknown"
    ],
    "years": [
      2025,
      2026
    ]
  },
  "kpis": {
    "total_waste_all": 32602.8,
    "total_2025": 28425.3,
    "total_2026": 4177.5,
    "pred_2026_annual": 7161.4,
    "next_month_prediction": 930.2,
    "growth_pct": -74.8,
    "yearly_trend": "FALLING",
    "monthly_trend": "FALLING",
    "monthly_change_pct": -50.7,
    "avg_monthly": 2037.7,
    "peak_monthly": 6633.4,
    "peak_vs_avg": 4595.7,
    "highest_barangay": "Ngan",
    "lowest_barangay": "Lagab",
    "highest_type": "Recyclable/Residual",
    "peak_month": "April 2025",
    "forecast_accuracy": 0.17,
    "forecast_error_pct": 0.83
  },
  "seasonality_index": {
    "1": 0.09,
    "2": 0.07,
    "3": 0.109,
    "4": 1.834,
    "5": 1.774,
    "6": 1.398,
    "7": 1.306,
    "8": 2.251,
    "9": 0.585,
    "10": 0.076,
    "11": 0.086,
    "12": 0.11
  },
  "monthly_data": [
    {
      "year": 2025,
      "month": "April",
      "month_no": 4,
      "total": 6633.4,
      "expected": 3737.2
    },
    {
      "year": 2025,
      "month": "May",
      "month_no": 5,
      "total": 6125.0,
      "expected": 3614.0
    },
    {
      "year": 2025,
      "month": "June",
      "month_no": 6,
      "total": 4569.0,
      "expected": 2849.5
    },
    {
      "year": 2025,
      "month": "July",
      "month_no": 7,
      "total": 4764.4,
      "expected": 2660.9
    },
    {
      "year": 2025,
      "month": "August",
      "month_no": 8,
      "total": 4586.5,
      "expected": 4586.5
    },
    {
      "year": 2025,
      "month": "September",
      "month_no": 9,
      "total": 1193.0,
      "expected": 1193.0
    },
    {
      "year": 2025,
      "month": "October",
      "month_no": 10,
      "total": 155.0,
      "expected": 155.0
    },
    {
      "year": 2025,
      "month": "November",
      "month_no": 11,
      "total": 174.5,
      "expected": 174.5
    },
    {
      "year": 2025,
      "month": "December",
      "month_no": 12,
      "total": 224.5,
      "expected": 224.5
    },
    {
      "year": 2026,
      "month": "January",
      "month_no": 1,
      "total": 182.5,
      "expected": 182.5
    },
    {
      "year": 2026,
      "month": "February",
      "month_no": 2,
      "total": 142.0,
      "expected": 142.0
    },
    {
      "year": 2026,
      "month": "March",
      "month_no": 3,
      "total": 221.5,
      "expected": 221.5
    },
    {
      "year": 2026,
      "month": "April",
      "month_no": 4,
      "total": 841.0,
      "expected": 3737.2
    },
    {
      "year": 2026,
      "month": "May",
      "month_no": 5,
      "total": 1103.0,
      "expected": 3614.0
    },
    {
      "year": 2026,
      "month": "June",
      "month_no": 6,
      "total": 1130.0,
      "expected": 2849.5
    },
    {
      "year": 2026,
      "month": "July",
      "month_no": 7,
      "total": 557.5,
      "expected": 2660.9
    }
  ],
  "barangay_comparison": [
    {
      "barangay": "Ngan",
      "y2025": 132.0,
      "y2026": 4161.5
    },
    {
      "barangay": "San Jose",
      "y2025": 4069.0,
      "y2026": 0
    },
    {
      "barangay": "San Miguel",
      "y2025": 3796.5,
      "y2026": 0
    },
    {
      "barangay": "Mangayon",
      "y2025": 3510.0,
      "y2026": 0
    },
    {
      "barangay": "Siocon",
      "y2025": 3345.5,
      "y2026": 4.5
    },
    {
      "barangay": "Bagongon",
      "y2025": 3050.5,
      "y2026": 0
    },
    {
      "barangay": "Osme\u00f1a",
      "y2025": 2967.0,
      "y2026": 0
    },
    {
      "barangay": "Maparat",
      "y2025": 2893.0,
      "y2026": 6.5
    },
    {
      "barangay": "New Alegria",
      "y2025": 2735.1,
      "y2026": 0
    },
    {
      "barangay": "Poblacion",
      "y2025": 1158.6,
      "y2026": 0
    },
    {
      "barangay": "Gabi",
      "y2025": 197.7,
      "y2026": 0
    },
    {
      "barangay": "Aurora",
      "y2025": 178.6,
      "y2026": 5.0
    },
    {
      "barangay": "Mapaca",
      "y2025": 148.0,
      "y2026": 0
    },
    {
      "barangay": "Tamia",
      "y2025": 144.5,
      "y2026": 0
    },
    {
      "barangay": "Lagab",
      "y2025": 99.3,
      "y2026": 0
    }
  ],
  "waste_type_summary": [
    {
      "type": "Recyclable/Residual",
      "total": 19378.4
    },
    {
      "type": "Unknown",
      "total": 7265.5
    },
    {
      "type": "Recyclable",
      "total": 3111.0
    },
    {
      "type": "Residual/Biodegradable",
      "total": 2200.0
    },
    {
      "type": "Special",
      "total": 500.0
    },
    {
      "type": "Residual",
      "total": 97.9
    },
    {
      "type": "Biodegradable",
      "total": 50.0
    }
  ],
  "anomalies": [
    {
      "year": 2025,
      "month": "June",
      "month_no": 6,
      "current": 4569.0,
      "previous": 6125.0,
      "change_pct": -25.4,
      "status": "WARNING"
    },
    {
      "year": 2025,
      "month": "September",
      "month_no": 9,
      "current": 1193.0,
      "previous": 4586.5,
      "change_pct": -74.0,
      "status": "CRITICAL ANOMALY"
    },
    {
      "year": 2025,
      "month": "October",
      "month_no": 10,
      "current": 155.0,
      "previous": 1193.0,
      "change_pct": -87.0,
      "status": "CRITICAL ANOMALY"
    },
    {
      "year": 2025,
      "month": "December",
      "month_no": 12,
      "current": 224.5,
      "previous": 174.5,
      "change_pct": 28.7,
      "status": "WARNING"
    },
    {
      "year": 2026,
      "month": "February",
      "month_no": 2,
      "current": 142.0,
      "previous": 182.5,
      "change_pct": -22.2,
      "status": "WARNING"
    },
    {
      "year": 2026,
      "month": "March",
      "month_no": 3,
      "current": 221.5,
      "previous": 142.0,
      "change_pct": 56.0,
      "status": "CRITICAL ANOMALY"
    },
    {
      "year": 2026,
      "month": "April",
      "month_no": 4,
      "current": 841.0,
      "previous": 221.5,
      "change_pct": 279.7,
      "status": "CRITICAL ANOMALY"
    },
    {
      "year": 2026,
      "month": "May",
      "month_no": 5,
      "current": 1103.0,
      "previous": 841.0,
      "change_pct": 31.2,
      "status": "WARNING"
    },
    {
      "year": 2026,
      "month": "July",
      "month_no": 7,
      "current": 557.5,
      "previous": 1130.0,
      "change_pct": -50.7,
      "status": "CRITICAL ANOMALY"
    }
  ],
  "barangay_yearly": [
    {
      "year": 2025,
      "barangay": "San Jose",
      "total": 4069.0
    },
    {
      "year": 2025,
      "barangay": "San Miguel",
      "total": 3796.5
    },
    {
      "year": 2025,
      "barangay": "Mangayon",
      "total": 3510.0
    },
    {
      "year": 2025,
      "barangay": "Siocon",
      "total": 3345.5
    },
    {
      "year": 2025,
      "barangay": "Bagongon",
      "total": 3050.5
    },
    {
      "year": 2025,
      "barangay": "Osme\u00f1a",
      "total": 2967.0
    },
    {
      "year": 2025,
      "barangay": "Maparat",
      "total": 2893.0
    },
    {
      "year": 2025,
      "barangay": "New Alegria",
      "total": 2735.1
    },
    {
      "year": 2025,
      "barangay": "Poblacion",
      "total": 1158.6
    },
    {
      "year": 2025,
      "barangay": "Gabi",
      "total": 197.7
    },
    {
      "year": 2025,
      "barangay": "Aurora",
      "total": 178.6
    },
    {
      "year": 2025,
      "barangay": "Mapaca",
      "total": 148.0
    },
    {
      "year": 2025,
      "barangay": "Tamia",
      "total": 144.5
    },
    {
      "year": 2025,
      "barangay": "Ngan",
      "total": 132.0
    },
    {
      "year": 2025,
      "barangay": "Lagab",
      "total": 99.3
    },
    {
      "year": 2026,
      "barangay": "Ngan",
      "total": 4161.5
    },
    {
      "year": 2026,
      "barangay": "Maparat",
      "total": 6.5
    },
    {
      "year": 2026,
      "barangay": "Aurora",
      "total": 5.0
    },
    {
      "year": 2026,
      "barangay": "Siocon",
      "total": 4.5
    }
  ],
  "by_type_yearly": [
    {
      "year": 2025,
      "waste_type": "Recyclable/Residual",
      "total": 19378.4
    },
    {
      "year": 2025,
      "waste_type": "Unknown",
      "total": 3304.0
    },
    {
      "year": 2025,
      "waste_type": "Recyclable",
      "total": 2895.0
    },
    {
      "year": 2025,
      "waste_type": "Residual/Biodegradable",
      "total": 2200.0
    },
    {
      "year": 2025,
      "waste_type": "Special",
      "total": 500.0
    },
    {
      "year": 2025,
      "waste_type": "Residual",
      "total": 97.9
    },
    {
      "year": 2025,
      "waste_type": "Biodegradable",
      "total": 50.0
    },
    {
      "year": 2026,
      "waste_type": "Unknown",
      "total": 3961.5
    },
    {
      "year": 2026,
      "waste_type": "Recyclable",
      "total": 216.0
    }
  ],
  "monthly_by_barangay": [
    {
      "year": 2025,
      "month": "April",
      "month_no": 4,
      "barangay": "Aurora",
      "total": 3.1
    },
    {
      "year": 2025,
      "month": "April",
      "month_no": 4,
      "barangay": "Bagongon",
      "total": 520.0
    },
    {
      "year": 2025,
      "month": "April",
      "month_no": 4,
      "barangay": "Gabi",
      "total": 4.2
    },
    {
      "year": 2025,
      "month": "April",
      "month_no": 4,
      "barangay": "Lagab",
      "total": 4.3
    },
    {
      "year": 2025,
      "month": "April",
      "month_no": 4,
      "barangay": "Mangayon",
      "total": 631.0
    },
    {
      "year": 2025,
      "month": "April",
      "month_no": 4,
      "barangay": "Mapaca",
      "total": 15.0
    },
    {
      "year": 2025,
      "month": "April",
      "month_no": 4,
      "barangay": "Maparat",
      "total": 911.0
    },
    {
      "year": 2025,
      "month": "April",
      "month_no": 4,
      "barangay": "New Alegria",
      "total": 857.1
    },
    {
      "year": 2025,
      "month": "April",
      "month_no": 4,
      "barangay": "Osme\u00f1a",
      "total": 607.0
    },
    {
      "year": 2025,
      "month": "April",
      "month_no": 4,
      "barangay": "Poblacion",
      "total": 71.2
    },
    {
      "year": 2025,
      "month": "April",
      "month_no": 4,
      "barangay": "San Jose",
      "total": 904.0
    },
    {
      "year": 2025,
      "month": "April",
      "month_no": 4,
      "barangay": "San Miguel",
      "total": 1400.0
    },
    {
      "year": 2025,
      "month": "April",
      "month_no": 4,
      "barangay": "Siocon",
      "total": 700.0
    },
    {
      "year": 2025,
      "month": "April",
      "month_no": 4,
      "barangay": "Tamia",
      "total": 5.5
    },
    {
      "year": 2025,
      "month": "May",
      "month_no": 5,
      "barangay": "Bagongon",
      "total": 725.0
    },
    {
      "year": 2025,
      "month": "May",
      "month_no": 5,
      "barangay": "Gabi",
      "total": 95.0
    },
    {
      "year": 2025,
      "month": "May",
      "month_no": 5,
      "barangay": "Lagab",
      "total": 30.0
    },
    {
      "year": 2025,
      "month": "May",
      "month_no": 5,
      "barangay": "Mangayon",
      "total": 845.0
    },
    {
      "year": 2025,
      "month": "May",
      "month_no": 5,
      "barangay": "Mapaca",
      "total": 30.0
    },
    {
      "year": 2025,
      "month": "May",
      "month_no": 5,
      "barangay": "Maparat",
      "total": 800.0
    },
    {
      "year": 2025,
      "month": "May",
      "month_no": 5,
      "barangay": "New Alegria",
      "total": 630.0
    },
    {
      "year": 2025,
      "month": "May",
      "month_no": 5,
      "barangay": "Osme\u00f1a",
      "total": 745.0
    },
    {
      "year": 2025,
      "month": "May",
      "month_no": 5,
      "barangay": "Poblacion",
      "total": 530.0
    },
    {
      "year": 2025,
      "month": "May",
      "month_no": 5,
      "barangay": "San Jose",
      "total": 770.0
    },
    {
      "year": 2025,
      "month": "May",
      "month_no": 5,
      "barangay": "San Miguel",
      "total": 90.0
    },
    {
      "year": 2025,
      "month": "May",
      "month_no": 5,
      "barangay": "Siocon",
      "total": 800.0
    },
    {
      "year": 2025,
      "month": "May",
      "month_no": 5,
      "barangay": "Tamia",
      "total": 35.0
    },
    {
      "year": 2025,
      "month": "June",
      "month_no": 6,
      "barangay": "Aurora",
      "total": 55.0
    },
    {
      "year": 2025,
      "month": "June",
      "month_no": 6,
      "barangay": "Bagongon",
      "total": 645.0
    },
    {
      "year": 2025,
      "month": "June",
      "month_no": 6,
      "barangay": "Gabi",
      "total": 45.0
    },
    {
      "year": 2025,
      "month": "June",
      "month_no": 6,
      "barangay": "Lagab",
      "total": 10.0
    },
    {
      "year": 2025,
      "month": "June",
      "month_no": 6,
      "barangay": "Mangayon",
      "total": 770.0
    },
    {
      "year": 2025,
      "month": "June",
      "month_no": 6,
      "barangay": "Mapaca",
      "total": 40.0
    },
    {
      "year": 2025,
      "month": "June",
      "month_no": 6,
      "barangay": "Maparat",
      "total": 123.0
    },
    {
      "year": 2025,
      "month": "June",
      "month_no": 6,
      "barangay": "New Alegria",
      "total": 32.0
    },
    {
      "year": 2025,
      "month": "June",
      "month_no": 6,
      "barangay": "Ngan",
      "total": 75.0
    },
    {
      "year": 2025,
      "month": "June",
      "month_no": 6,
      "barangay": "Osme\u00f1a",
      "total": 555.0
    },
    {
      "year": 2025,
      "month": "June",
      "month_no": 6,
      "barangay": "Poblacion",
      "total": 216.0
    },
    {
      "year": 2025,
      "month": "June",
      "month_no": 6,
      "barangay": "San Jose",
      "total": 640.0
    },
    {
      "year": 2025,
      "month": "June",
      "month_no": 6,
      "barangay": "San Miguel",
      "total": 635.0
    },
    {
      "year": 2025,
      "month": "June",
      "month_no": 6,
      "barangay": "Siocon",
      "total": 685.0
    },
    {
      "year": 2025,
      "month": "June",
      "month_no": 6,
      "barangay": "Tamia",
      "total": 43.0
    },
    {
      "year": 2025,
      "month": "July",
      "month_no": 7,
      "barangay": "Aurora",
      "total": 83.0
    },
    {
      "year": 2025,
      "month": "July",
      "month_no": 7,
      "barangay": "Bagongon",
      "total": 510.5
    },
    {
      "year": 2025,
      "month": "July",
      "month_no": 7,
      "barangay": "Gabi",
      "total": 16.0
    },
    {
      "year": 2025,
      "month": "July",
      "month_no": 7,
      "barangay": "Lagab",
      "total": 12.0
    },
    {
      "year": 2025,
      "month": "July",
      "month_no": 7,
      "barangay": "Mangayon",
      "total": 616.5
    },
    {
      "year": 2025,
      "month": "July",
      "month_no": 7,
      "barangay": "Mapaca",
      "total": 15.0
    },
    {
      "year": 2025,
      "month": "July",
      "month_no": 7,
      "barangay": "Maparat",
      "total": 412.5
    },
    {
      "year": 2025,
      "month": "July",
      "month_no": 7,
      "barangay": "New Alegria",
      "total": 515.0
    },
    {
      "year": 2025,
      "month": "July",
      "month_no": 7,
      "barangay": "Ngan",
      "total": 12.5
    },
    {
      "year": 2025,
      "month": "July",
      "month_no": 7,
      "barangay": "Osme\u00f1a",
      "total": 604.0
    },
    {
      "year": 2025,
      "month": "July",
      "month_no": 7,
      "barangay": "Poblacion",
      "total": 96.4
    },
    {
      "year": 2025,
      "month": "July",
      "month_no": 7,
      "barangay": "San Jose",
      "total": 517.5
    },
    {
      "year": 2025,
      "month": "July",
      "month_no": 7,
      "barangay": "San Miguel",
      "total": 722.5
    },
    {
      "year": 2025,
      "month": "July",
      "month_no": 7,
      "barangay": "Siocon",
      "total": 615.0
    },
    {
      "year": 2025,
      "month": "July",
      "month_no": 7,
      "barangay": "Tamia",
      "total": 16.0
    },
    {
      "year": 2025,
      "month": "August",
      "month_no": 8,
      "barangay": "Aurora",
      "total": 6.5
    },
    {
      "year": 2025,
      "month": "August",
      "month_no": 8,
      "barangay": "Bagongon",
      "total": 607.0
    },
    {
      "year": 2025,
      "month": "August",
      "month_no": 8,
      "barangay": "Gabi",
      "total": 9.5
    },
    {
      "year": 2025,
      "month": "August",
      "month_no": 8,
      "barangay": "Mangayon",
      "total": 611.5
    },
    {
      "year": 2025,
      "month": "August",
      "month_no": 8,
      "barangay": "Mapaca",
      "total": 8.5
    },
    {
      "year": 2025,
      "month": "August",
      "month_no": 8,
      "barangay": "Maparat",
      "total": 611.5
    },
    {
      "year": 2025,
      "month": "August",
      "month_no": 8,
      "barangay": "New Alegria",
      "total": 617.5
    },
    {
      "year": 2025,
      "month": "August",
      "month_no": 8,
      "barangay": "Ngan",
      "total": 8.0
    },
    {
      "year": 2025,
      "month": "August",
      "month_no": 8,
      "barangay": "Osme\u00f1a",
      "total": 418.5
    },
    {
      "year": 2025,
      "month": "August",
      "month_no": 8,
      "barangay": "Poblacion",
      "total": 49.5
    },
    {
      "year": 2025,
      "month": "August",
      "month_no": 8,
      "barangay": "San Jose",
      "total": 604.5
    },
    {
      "year": 2025,
      "month": "August",
      "month_no": 8,
      "barangay": "San Miguel",
      "total": 508.5
    },
    {
      "year": 2025,
      "month": "August",
      "month_no": 8,
      "barangay": "Siocon",
      "total": 514.5
    },
    {
      "year": 2025,
      "month": "August",
      "month_no": 8,
      "barangay": "Tamia",
      "total": 11.0
    },
    {
      "year": 2025,
      "month": "September",
      "month_no": 9,
      "barangay": "Aurora",
      "total": 7.5
    },
    {
      "year": 2025,
      "month": "September",
      "month_no": 9,
      "barangay": "Bagongon",
      "total": 13.5
    },
    {
      "year": 2025,
      "month": "September",
      "month_no": 9,
      "barangay": "Gabi",
      "total": 15.5
    },
    {
      "year": 2025,
      "month": "September",
      "month_no": 9,
      "barangay": "Lagab",
      "total": 12.0
    },
    {
      "year": 2025,
      "month": "September",
      "month_no": 9,
      "barangay": "Mangayon",
      "total": 9.5
    },
    {
      "year": 2025,
      "month": "September",
      "month_no": 9,
      "barangay": "Mapaca",
      "total": 11.5
    },
    {
      "year": 2025,
      "month": "September",
      "month_no": 9,
      "barangay": "Maparat",
      "total": 7.5
    },
    {
      "year": 2025,
      "month": "September",
      "month_no": 9,
      "barangay": "New Alegria",
      "total": 6.0
    },
    {
      "year": 2025,
      "month": "September",
      "month_no": 9,
      "barangay": "Ngan",
      "total": 11.0
    },
    {
      "year": 2025,
      "month": "September",
      "month_no": 9,
      "barangay": "Osme\u00f1a",
      "total": 7.0
    },
    {
      "year": 2025,
      "month": "September",
      "month_no": 9,
      "barangay": "Poblacion",
      "total": 57.0
    },
    {
      "year": 2025,
      "month": "September",
      "month_no": 9,
      "barangay": "San Jose",
      "total": 607.5
    },
    {
      "year": 2025,
      "month": "September",
      "month_no": 9,
      "barangay": "San Miguel",
      "total": 412.0
    },
    {
      "year": 2025,
      "month": "September",
      "month_no": 9,
      "barangay": "Siocon",
      "total": 7.5
    },
    {
      "year": 2025,
      "month": "September",
      "month_no": 9,
      "barangay": "Tamia",
      "total": 8.0
    },
    {
      "year": 2025,
      "month": "October",
      "month_no": 10,
      "barangay": "Aurora",
      "total": 3.0
    },
    {
      "year": 2025,
      "month": "October",
      "month_no": 10,
      "barangay": "Bagongon",
      "total": 6.0
    },
    {
      "year": 2025,
      "month": "October",
      "month_no": 10,
      "barangay": "Gabi",
      "total": 4.0
    },
    {
      "year": 2025,
      "month": "October",
      "month_no": 10,
      "barangay": "Lagab",
      "total": 12.5
    },
    {
      "year": 2025,
      "month": "October",
      "month_no": 10,
      "barangay": "Mangayon",
      "total": 6.5
    },
    {
      "year": 2025,
      "month": "October",
      "month_no": 10,
      "barangay": "Mapaca",
      "total": 8.0
    },
    {
      "year": 2025,
      "month": "October",
      "month_no": 10,
      "barangay": "Maparat",
      "total": 5.5
    },
    {
      "year": 2025,
      "month": "October",
      "month_no": 10,
      "barangay": "New Alegria",
      "total": 11.0
    },
    {
      "year": 2025,
      "month": "October",
      "month_no": 10,
      "barangay": "Ngan",
      "total": 4.5
    },
    {
      "year": 2025,
      "month": "October",
      "month_no": 10,
      "barangay": "Osme\u00f1a",
      "total": 10.0
    },
    {
      "year": 2025,
      "month": "October",
      "month_no": 10,
      "barangay": "Poblacion",
      "total": 58.0
    },
    {
      "year": 2025,
      "month": "October",
      "month_no": 10,
      "barangay": "San Jose",
      "total": 6.5
    },
    {
      "year": 2025,
      "month": "October",
      "month_no": 10,
      "barangay": "San Miguel",
      "total": 9.0
    },
    {
      "year": 2025,
      "month": "October",
      "month_no": 10,
      "barangay": "Siocon",
      "total": 3.5
    },
    {
      "year": 2025,
      "month": "October",
      "month_no": 10,
      "barangay": "Tamia",
      "total": 7.0
    },
    {
      "year": 2025,
      "month": "November",
      "month_no": 11,
      "barangay": "Aurora",
      "total": 11.0
    },
    {
      "year": 2025,
      "month": "November",
      "month_no": 11,
      "barangay": "Bagongon",
      "total": 12.0
    },
    {
      "year": 2025,
      "month": "November",
      "month_no": 11,
      "barangay": "Gabi",
      "total": 3.5
    },
    {
      "year": 2025,
      "month": "November",
      "month_no": 11,
      "barangay": "Lagab",
      "total": 12.0
    },
    {
      "year": 2025,
      "month": "November",
      "month_no": 11,
      "barangay": "Mangayon",
      "total": 8.5
    },
    {
      "year": 2025,
      "month": "November",
      "month_no": 11,
      "barangay": "Mapaca",
      "total": 8.0
    },
    {
      "year": 2025,
      "month": "November",
      "month_no": 11,
      "barangay": "Maparat",
      "total": 12.0
    },
    {
      "year": 2025,
      "month": "November",
      "month_no": 11,
      "barangay": "New Alegria",
      "total": 12.0
    },
    {
      "year": 2025,
      "month": "November",
      "month_no": 11,
      "barangay": "Ngan",
      "total": 11.0
    },
    {
      "year": 2025,
      "month": "November",
      "month_no": 11,
      "barangay": "Osme\u00f1a",
      "total": 10.0
    },
    {
      "year": 2025,
      "month": "November",
      "month_no": 11,
      "barangay": "Poblacion",
      "total": 41.5
    },
    {
      "year": 2025,
      "month": "November",
      "month_no": 11,
      "barangay": "San Jose",
      "total": 8.0
    },
    {
      "year": 2025,
      "month": "November",
      "month_no": 11,
      "barangay": "San Miguel",
      "total": 8.5
    },
    {
      "year": 2025,
      "month": "November",
      "month_no": 11,
      "barangay": "Siocon",
      "total": 9.0
    },
    {
      "year": 2025,
      "month": "November",
      "month_no": 11,
      "barangay": "Tamia",
      "total": 7.5
    },
    {
      "year": 2025,
      "month": "December",
      "month_no": 12,
      "barangay": "Aurora",
      "total": 9.5
    },
    {
      "year": 2025,
      "month": "December",
      "month_no": 12,
      "barangay": "Bagongon",
      "total": 11.5
    },
    {
      "year": 2025,
      "month": "December",
      "month_no": 12,
      "barangay": "Gabi",
      "total": 5.0
    },
    {
      "year": 2025,
      "month": "December",
      "month_no": 12,
      "barangay": "Lagab",
      "total": 6.5
    },
    {
      "year": 2025,
      "month": "December",
      "month_no": 12,
      "barangay": "Mangayon",
      "total": 11.5
    },
    {
      "year": 2025,
      "month": "December",
      "month_no": 12,
      "barangay": "Mapaca",
      "total": 12.0
    },
    {
      "year": 2025,
      "month": "December",
      "month_no": 12,
      "barangay": "Maparat",
      "total": 10.0
    },
    {
      "year": 2025,
      "month": "December",
      "month_no": 12,
      "barangay": "New Alegria",
      "total": 54.5
    },
    {
      "year": 2025,
      "month": "December",
      "month_no": 12,
      "barangay": "Ngan",
      "total": 10.0
    },
    {
      "year": 2025,
      "month": "December",
      "month_no": 12,
      "barangay": "Osme\u00f1a",
      "total": 10.5
    },
    {
      "year": 2025,
      "month": "December",
      "month_no": 12,
      "barangay": "Poblacion",
      "total": 39.0
    },
    {
      "year": 2025,
      "month": "December",
      "month_no": 12,
      "barangay": "San Jose",
      "total": 11.0
    },
    {
      "year": 2025,
      "month": "December",
      "month_no": 12,
      "barangay": "San Miguel",
      "total": 11.0
    },
    {
      "year": 2025,
      "month": "December",
      "month_no": 12,
      "barangay": "Siocon",
      "total": 11.0
    },
    {
      "year": 2025,
      "month": "December",
      "month_no": 12,
      "barangay": "Tamia",
      "total": 11.5
    },
    {
      "year": 2026,
      "month": "January",
      "month_no": 1,
      "barangay": "Aurora",
      "total": 5.0
    },
    {
      "year": 2026,
      "month": "January",
      "month_no": 1,
      "barangay": "Maparat",
      "total": 6.5
    },
    {
      "year": 2026,
      "month": "January",
      "month_no": 1,
      "barangay": "Ngan",
      "total": 166.5
    },
    {
      "year": 2026,
      "month": "January",
      "month_no": 1,
      "barangay": "Siocon",
      "total": 4.5
    },
    {
      "year": 2026,
      "month": "February",
      "month_no": 2,
      "barangay": "Ngan",
      "total": 142.0
    },
    {
      "year": 2026,
      "month": "March",
      "month_no": 3,
      "barangay": "Ngan",
      "total": 221.5
    },
    {
      "year": 2026,
      "month": "April",
      "month_no": 4,
      "barangay": "Ngan",
      "total": 841.0
    },
    {
      "year": 2026,
      "month": "May",
      "month_no": 5,
      "barangay": "Ngan",
      "total": 1103.0
    },
    {
      "year": 2026,
      "month": "June",
      "month_no": 6,
      "barangay": "Ngan",
      "total": 1130.0
    },
    {
      "year": 2026,
      "month": "July",
      "month_no": 7,
      "barangay": "Ngan",
      "total": 557.5
    }
  ]
};

// Helper functions matching DAX measures
function formatKg(n) {
  if (n >= 1000000) return (n/1000000).toFixed(2) + 'M';
  if (n >= 1000) return (n/1000).toFixed(2) + 'K';
  return n.toFixed(1);
}

function getBarangayTotal(barangay, year) {
  const list = WASTE_DATA.barangay_yearly.filter(r => r.barangay === barangay && (!year || r.year === year));
  return list.reduce((s, r) => s + r.total, 0);
}

function getFilteredMonthly(filters = {}) {
  let data = WASTE_DATA.monthly_by_barangay;
  if (filters.barangay && filters.barangay !== 'All')
    data = data.filter(r => r.barangay === filters.barangay);
  if (filters.year && filters.year !== 'All')
    data = data.filter(r => r.year === Number(filters.year));
  if (filters.month_no && filters.month_no !== 'All')
    data = data.filter(r => r.month_no === Number(filters.month_no));
  return data;
}
