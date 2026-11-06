/**
 * Personalised Nutrition Programmes for TheHealthyStitch.
 *
 * 1. The Starter Programme (1 Month trial)
 * 2. The Consistency Programme (3 Months flagship)
 * 3. The Lifestyle Transformation Programme (6 Months extended guidance)
 * 4. The Long-Term Wellness Programme (12 Months complete wellness)
 */

export const PROGRAMMES = [
  {
    id: 'starter',
    code: 'PROG-01',
    name: 'The Starter Programme',
    duration: '1 Month',
    badge: 'Trial Programme',
    isFlagship: false,
    tagline: 'Experience a personalised approach to nutrition.',
    description:
      'A focused one-month trial designed to audit your current habits, identify nutritional gaps, and experience structured, whole-food dietary guidance.',
    inheritance: null,
    inclusions: [
      'Initial consultation and lifestyle assessment',
      'Understanding of current eating habits',
      'One personalised nutrition plan',
      'One diet plan revision during the month',
      'Meal timing and portion guidance',
      'Practical food swaps and alternatives',
      'Basic protein and fibre guidance',
      'WhatsApp doubt-solving when required',
      'One progress assessment',
      'Follow-up call if required',
    ],
    idealFor:
      'Individuals who want to experience personalised nutrition guidance before committing to a longer programme.',
    highlights: ['1 Personalized Diet Plan', '1 Revision', 'WhatsApp Support'],
  },
  {
    id: 'consistency',
    code: 'PROG-02',
    name: 'The Consistency Programme',
    duration: '3 Months',
    badge: 'Flagship Programme',
    isFlagship: true,
    tagline: 'Build consistency. Improve your relationship with food. Develop sustainable habits.',
    description:
      'Our most popular 12-week framework that turns healthy eating into second nature through regular plan calibrations, vegetarian protein optimization, and social dining strategies.',
    inheritance: 'Everything in the Starter Programme, plus:',
    inclusions: [
      'Twice-monthly customised diet plan updates',
      'Monthly progress and goal assessment',
      'Regular dietary habit evaluation',
      'Personalised vegetarian protein guidance',
      'Eating-out and restaurant food guidance',
      'Healthy snacking guide',
      'Festival and social gathering food strategies',
      'Lifestyle and routine improvement guidance',
      'WhatsApp doubt-solving when required',
      'Follow-up calls whenever necessary',
    ],
    idealFor:
      'Individuals looking to work consistently towards weight management, improved nutrition and healthier eating habits.',
    highlights: ['Twice-Monthly Plan Updates', 'Restaurant & Festival Guides', 'Vegetarian Protein Mastery'],
  },
  {
    id: 'lifestyle-transformation',
    code: 'PROG-03',
    name: 'The Lifestyle Transformation Programme',
    duration: '6 Months',
    badge: 'Extended Guidance',
    isFlagship: false,
    tagline: 'Go beyond diet plans and build habits that fit your lifestyle.',
    description:
      'A half-year comprehensive journey that integrates meal prep systems, grocery literacy, travel dining, and deep habit conditioning into your daily rhythm.',
    inheritance: 'Everything in the Consistency Programme, plus:',
    inclusions: [
      'Twice-monthly customised diet plan updates throughout the programme',
      'Detailed monthly progress evaluation',
      'Individualised nutrition adjustments based on progress',
      'Advanced protein and nutritional balance guidance',
      'Grocery shopping and food selection guide',
      'Meal preparation and planning strategies',
      'Travel and vacation nutrition guidance',
      'Seasonal and festive eating strategies',
      'Lifestyle habit development',
      'Weight maintenance and sustainability guidance',
      'Follow-up calls whenever necessary',
    ],
    idealFor:
      'Individuals who want longer-term nutritional guidance and support in making meaningful lifestyle changes.',
    highlights: ['Grocery & Meal-Prep Systems', 'Travel & Seasonal Strategies', 'Weight Maintenance Blueprint'],
  },
  {
    id: 'long-term-wellness',
    code: 'PROG-04',
    name: 'The Long-Term Wellness Programme',
    duration: '12 Months',
    badge: 'Complete Wellness Programme',
    isFlagship: false,
    tagline: 'Make healthy living a part of your everyday life.',
    description:
      'A full year of continuous nutritional stewardship and accountability, achieving total dietary independence, seasonal adaptation, and long-term relapse prevention.',
    inheritance: 'Everything in the Lifestyle Transformation Programme, plus:',
    inclusions: [
      'Year-round personalised nutrition guidance',
      'Twice-monthly customised diet plan updates',
      'Monthly progress assessments',
      'Quarterly goal reassessment',
      'Long-term weight management strategies',
      'Seasonal nutrition planning',
      'Festival, travel and dining-out strategies',
      'Advanced food independence and portion awareness',
      'Long-term habit maintenance strategies',
      'Relapse prevention and routine management',
      'Support through changing lifestyle requirements',
      'Follow-up calls whenever necessary',
    ],
    idealFor:
      'Individuals who want continuous nutrition guidance and accountability while developing independent, sustainable eating habits.',
    highlights: ['Full Year Support', 'Quarterly Goal Reassessment', 'Complete Food Independence'],
  },
]

