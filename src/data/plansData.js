/**
 * The 14 Health & Nutrition Goal Categories for TheHealthyStitch.
 *
 * Each category represents a personalized health goal designed around
 * individual blood biomarkers, dietary practices, and lifestyle routines.
 * Recommendations are subject to clinical assessment without generic
 * diet packages or medical claims.
 */

export const HEALTH_CATEGORIES = [
  {
    id: 'jain-nutrition',
    num: '01',
    title: 'Jain Nutrition',
    tagline: 'Strict vegetarian sanctity paired with clinical nutrient completeness',
    shortDescription:
      'Nutritionally balanced plans observing traditional Jain dietary principles without root vegetables, structured to prevent B12, iron, and protein deficits.',
    approach:
      'We construct complete plant protein profiles by combining permitted pulses, grains, seeds, and allowable seasonal gourds. Micronutrient adequacy (ferritin, zinc, B12, Vitamin D) is planned intentionally using traditional kitchen wisdom and verified food pairings.',
    consultation:
      'Detailed review of your household kitchen traditions, seasonal observances (tithis, Paryushan), baseline blood panels, and current energy levels.',
    support:
      'Personalized seasonal ingredient swaps, mindful fasting-transition protocols, restaurant dining guidance, and weekly progress check-ins via WhatsApp.',
    focusAreas: ['Zero Root Vegetables', 'Amino Acid Pairing', 'Fasting Recovery'],
    icon: 'Leaf',
  },
  {
    id: 'fat-loss',
    num: '02',
    title: 'Fat Loss / Weight Loss',
    tagline: 'Sustainable body composition through everyday home cooking',
    shortDescription:
      'Calibrated energy and macronutrient balance built around foods you already cook, designed for lasting metabolic vitality without restrictive starvation.',
    approach:
      'Rather than restrictive calorie deficits or artificial meal replacements, we calibrate portion sizes, fiber viscosity, and protein pacing across your standard home dishes (dal, sabzi, roti, rice) to support satiety and lean muscle preservation.',
    consultation:
      'Assessment of metabolic history, past dieting cycles, daily activity patterns, hunger rhythms, and working schedule.',
    support:
      'Flexible meal frameworks with standard home vessel portioning, eating-out strategies, celebratory meal resets, and fortnightly progress reviews.',
    focusAreas: ['Satiety Pacing', 'Home-Cooked Staples', 'Metabolic Adaptation'],
    icon: 'Scale',
  },
  {
    id: 'diabetes-care',
    num: '03',
    title: 'Diabetes Care',
    tagline: 'Glycemic steadiness through smart carbohydrate sequencing',
    shortDescription:
      'Evidence-informed nutrition focused on moderating postprandial glucose surges, improving insulin sensitivity, and protecting metabolic stability.',
    approach:
      'We combine high-viscosity soluble fibers (fenugreek, legumes, oats) with healthy fats and protein to dampen blood sugar absorption. Meal sequencing—eating fiber and protein before starchy staples—naturally stabilizes blood glucose curves.',
    consultation:
      'Evaluation of recent HbA1c, fasting glucose, insulin levels, medication timings (in alignment with your physician), and daily meal timings.',
    support:
      'Carbohydrate pacing schedules, practical blood-sugar-friendly snack alternatives, dining-out guidelines, and regular glycemic trend reviews.',
    focusAreas: ['Glycemic Load Control', 'Meal Sequencing', 'Insulin Sensitivity'],
    icon: 'Activity',
  },
  {
    id: 'thyroid-care',
    num: '04',
    title: 'Thyroid Care',
    tagline: 'Nutritional co-factors for healthy endocrine balance and energy',
    shortDescription:
      'Targeted vegetarian nutrition supporting thyroid hormone conversion, combative against persistent fatigue, sluggish metabolism, and fluid retention.',
    approach:
      'Ensuring consistent dietary availability of essential conversion co-factors (selenium, zinc, tyrosine, and iron) while properly preparing cruciferous vegetables and legumes to neutralize goitrogenic effects.',
    consultation:
      'Analysis of full thyroid profiles (TSH, Free T3, Free T4, anti-TPO), body temperature fluctuations, bowel transit time, and energy cycles.',
    support:
      'Co-factor nutrient pairing charts, anti-inflammatory whole-food recipes, sleep-nutrition alignment, and quarterly lab tracking.',
    focusAreas: ['Conversion Co-Factors', 'Anti-Inflammatory Rhythm', 'Energy Stability'],
    icon: 'Flame',
  },
  {
    id: 'hypertension-management',
    num: '05',
    title: 'Hypertension Management (Blood Pressure)',
    tagline: 'Electrolyte balance and vascular calm through mineral-rich nutrition',
    shortDescription:
      'Whole-food dietary strategies focused on balancing sodium-potassium ratios, dietary nitrates, and magnesium to encourage arterial relaxation.',
    approach:
      'We systematically replace hidden commercial sodium with mineral-rich whole foods, leafy greens, celery, seeds, and traditional acid pairings (lemon, amchur) to maintain vibrant flavor while promoting healthy blood pressure.',
    consultation:
      'Review of your daily blood pressure logs, sodium sources in everyday home recipes, fluid intake patterns, and lifestyle stress factors.',
    support:
      'Flavourful salt-smart seasoning protocols, arterial-protective meal plans, hydration pacing, and consistent lifestyle check-ins.',
    focusAreas: ['Potassium-Sodium Ratio', 'Arterial Elasticity', 'Salt-Smart Flavour'],
    icon: 'HeartPulse',
  },
  {
    id: 'cardiovascular-care',
    num: '06',
    title: 'Cardiovascular Care',
    tagline: 'Lipid profile refinement through high-fiber plant architecture',
    shortDescription:
      'Soluble fiber-rich, heart-protective nutrition targeting elevated LDL cholesterol, triglycerides, and ApoB particle count through natural food mechanisms.',
    approach:
      'Soluble viscous fibers actively bind bile acids in the digestive tract, encouraging the liver to clear circulating LDL. We incorporate cold-pressed healthy fats, walnuts, flax, and antioxidant-rich plant pigments to support vascular endothelium.',
    consultation:
      'Detailed examination of lipid panels (Total Cholesterol, LDL, HDL, Triglycerides, ApoB), family cardiovascular history, and cooking oil usage.',
    support:
      'Pantry oil and fat guidance, fiber-dosing plans (targeting 35g+ daily), heart-healthy snack ideas, and collaborative physician review.',
    focusAreas: ['LDL & ApoB Clearance', 'Viscous Soluble Fibre', 'Endothelial Support'],
    icon: 'Heart',
  },
  {
    id: 'pcos-pcod-care',
    num: '07',
    title: 'PCOS / PCOD Care',
    tagline: 'Hormonal harmony and metabolic rhythm from within',
    shortDescription:
      'Holistic dietary protocols addressing root hormonal drivers—insulin resistance, hyperandrogenism, and chronic systemic inflammation.',
    approach:
      'Focusing on low-glycemic load, whole-grain combinations, inositol-rich seeds, and healthy plant fats that support ovulation, reduce androgenic symptoms (hair thinning, acne), and calm inflammatory triggers.',
    consultation:
      'Timeline review of menstrual regularity, ultrasound reports, symptom history (cravings, fatigue, hirsutism), and current stress and sleep routines.',
    support:
      'Cycle-synchronised nutritional tips, natural craving-management strategies, pantry ingredient swaps, and weekly empathetic support.',
    focusAreas: ['Insulin Regulation', 'Cycle Regularity', 'Anti-Androgenic Foods'],
    icon: 'Flower2',
  },
  {
    id: 'skin-hair-care',
    num: '08',
    title: 'Skin & Hair Care',
    tagline: 'Cellular nourishment for dermal glow and follicular vitality',
    shortDescription:
      'Internal nutrition addressing micronutrient deficits, collagen synthesis co-factors, oxidative stress, and gut-skin axis health.',
    approach:
      'Nourishing the dermal matrix from within through antioxidant-dense seasonal produce, bioavailable zinc, vitamin C, sulfur-rich pulses, and healthy omega fatty acids that fuel follicular strength and skin barrier integrity.',
    consultation:
      'Review of hair fall patterns, skin barrier concerns (dryness, acne, premature aging), hydration levels, and serum ferritin / zinc levels.',
    support:
      'Antioxidant-dense meal additions, gut-skin connection strategies, hydration trackers, and photographic milestone reviews.',
    focusAreas: ['Gut-Skin Axis', 'Collagen Co-Factors', 'Follicular Nutrition'],
    icon: 'Sparkles',
  },
  {
    id: 'hormonal-disorder-management',
    num: '09',
    title: 'Hormonal Disorder Management',
    tagline: 'Endocrine rhythm and restorative circadian nutrition',
    shortDescription:
      'Personalised nutrition support for cortisol regulation, adrenal fatigue, estrogen-progesterone balance, and perimenopausal transitions.',
    approach:
      'Synchronizing meal timings with natural circadian hormone peaks, integrating seed cycling, phytoestrogen-balanced pulses, and magnesium-rich greens to ease hormonal fluctuations and sleep disruptions.',
    consultation:
      'Comprehensive symptom timeline across sleep architecture, mood fluctuations, cycle predictability, hot flashes, and stress biomarkers.',
    support:
      'Circadian meal schedules, calming evening nutritional rituals, stress-response food strategies, and bi-weekly review consultations.',
    focusAreas: ['Circadian Meal Timing', 'Cortisol Balance', 'Phytoestrogen Synergy'],
    icon: 'Clock',
  },
  {
    id: 'gut-health',
    num: '10',
    title: 'Gut Health',
    tagline: 'Cultivating microbial diversity and seamless digestive ease',
    shortDescription:
      'Targeted nutrition for bloating, acidity, irregular bowel transit, IBS triggers, and suboptimal nutrient assimilation.',
    approach:
      'Carefully graduated prebiotic fibers, fermented probiotic preparations, and soothing digestive spices (cumin, ajwain, ginger) to rebuild mucosal resilience and foster a diverse, resilient gut microbiome.',
    consultation:
      'In-depth stool consistency review (Bristol Stool Form), digestive transit log, dietary trigger mapping, and antibiotic history.',
    support:
      'Phased gentle fiber introduction, soothing post-meal infusions, gut-healing recipe cards, and weekly digestive feedback checks.',
    focusAreas: ['Microbial Diversity', 'Digestive Transit', 'Bloating Resolution'],
    icon: 'UtensilsCrossed',
  },
  {
    id: 'fatty-liver-management',
    num: '11',
    title: 'Fatty Liver Management',
    tagline: 'Hepatic rejuvenation and visceral metabolic clearance',
    shortDescription:
      'Evidence-based nutritional realignment designed to reduce hepatic fat accumulation, lower liver enzymes, and optimize liver metabolism.',
    approach:
      'Eliminating hidden high-fructose syrups and refined carbohydrate overload while boosting liver-protective antioxidants, choline-rich ingredients, betaine, and sulfur-bearing greens that assist liver detoxification pathways.',
    consultation:
      'Review of recent abdominal ultrasound (Grade I/II fatty liver), liver function tests (SGOT, SGPT, GGT), and daily snacking habits.',
    support:
      'Hepatic-clearing meal structures, pantry decluttering guide, active movement-nutrition integration, and follow-up lab review.',
    focusAreas: ['Hepatic De-Fatting', 'SGOT/SGPT Normalisation', 'Fructose Elimination'],
    icon: 'ShieldCheck',
  },
  {
    id: 'arthritis-care',
    num: '12',
    title: 'Arthritis Care',
    tagline: 'Easing joint stiffness and systemic inflammation through whole foods',
    shortDescription:
      'Targeted anti-inflammatory vegetarian therapy to soothe joint pain, support synovial lubrication, and enhance daily physical mobility.',
    approach:
      'Harnessing culinary anti-inflammatory powerhouses (turmeric with black pepper, cold-pressed virgin mustard or olive oils, ginger, walnuts) combined with alkalizing greens to reduce inflammatory cytokines (ESR/CRP).',
    consultation:
      'Evaluation of joint stiffness patterns, inflammatory blood markers, nightshade food sensitivity history, and daily movement limits.',
    support:
      'Joint-soothing warming recipes, anti-inflammatory spice blends, hydration and uric acid moderation guidance, and mobility tracking.',
    focusAreas: ['Inflammation Reduction', 'Synovial Nourishment', 'Joint Mobility'],
    icon: 'Bone',
  },
  {
    id: 'pre-post-pregnancy-care',
    num: '13',
    title: 'Pre & Post Pregnancy Care',
    tagline: 'Maternal nutrient reserves and restorative postnatal healing',
    shortDescription:
      'Preconception maternal priming and postpartum recovery nutrition supporting tissue restoration, sustained lactation, and vibrant energy.',
    approach:
      'Preconception focus on folate-rich greens, iron, and zinc reserves; postpartum focus on gentle, deeply digestible nutrient broths, traditional galactagogue preparations, calcium replenishment, and fatigue mitigation.',
    consultation:
      'Review of preconception blood panels or delivery stage (normal/c-section), lactation demands, digestive sensitivity, and sleep constraints.',
    support:
      'Lactation-supporting traditional recipes, nutrient-dense quick meals, emotional nourishment check-ins, and flexible postpartum scheduling.',
    focusAreas: ['Preconception Priming', 'Postnatal Tissue Healing', 'Lactation Nourishment'],
    icon: 'HeartHandshake',
  },
  {
    id: 'pregnancy-care',
    num: '14',
    title: 'Pregnancy Care',
    tagline: 'Trimester-by-trimester nutritional stewardship for mother and baby',
    shortDescription:
      'Carefully staged vegetarian nutrition supporting optimal fetal organ development, gestational vitality, and maternal well-being throughout all 40 weeks.',
    approach:
      'Tailored macro and micronutrient staging: folate and nausea management in the 1st trimester; iron, calcium, and protein acceleration in the 2nd; blood volume, glycemic control, and gentle digestion in the 3rd trimester.',
    consultation:
      'Trimester timeline review, obstetrician growth scan findings, gestational blood sugar and hemoglobin monitoring, and craving/aversion mapping.',
    support:
      'Trimester-wise recipe adjustments, morning sickness natural remedies, healthy gestational weight pacing, and constant WhatsApp reassurance.',
    focusAreas: ['Trimester Staging', 'Fetal Development', 'Gestational Wellness'],
    icon: 'Baby',
  },
]

