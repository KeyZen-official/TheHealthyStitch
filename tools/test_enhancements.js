import fs from 'node:fs'
import path from 'node:path'

const EXPECTED_PROGRAMMES = [
  'The Starter Programme',
  'The Consistency Programme',
  'The Lifestyle Transformation Programme',
  'The Long-Term Wellness Programme',
]

const EXPECTED_CATEGORIES = [
  'Jain Nutrition',
  'Fat Loss / Weight Loss',
  'Diabetes Care',
  'Thyroid Care',
  'Hypertension Management (Blood Pressure)',
  'Cardiovascular Care',
  'PCOS / PCOD Care',
  'Skin & Hair Care',
  'Hormonal Disorder Management',
  'Gut Health',
  'Fatty Liver Management',
  'Arthritis Care',
  'Pre & Post Pregnancy Care',
  'Pregnancy Care',
]

const EXPECTED_DIET_OPTIONS = ['Jain', 'Vegetarian', 'Other']

const EXPECTED_TIME_OPTIONS = [
  'Morning (10 AM – 12 PM)',
  'Evening (4 PM – 7 PM)',
  'Flexible',
]

async function testStaticBuild() {
  console.log('\n--- 1. Testing Production Build Output ---')
  const distDir = path.resolve('./dist')
  if (!fs.existsSync(distDir)) {
    throw new Error('dist directory does not exist! Run npm run build first.')
  }

  const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')

  // Brand Name in Title & Metadata
  if (!indexHtml.includes('<title>TheHealthyStitch — Wellness Walk</title>')) {
    throw new Error('index.html title does not match "TheHealthyStitch — Wellness Walk"')
  }
  console.log('✓ Page title verified: "TheHealthyStitch — Wellness Walk"')

  if (!indexHtml.includes('content="TheHealthyStitch builds vegetarian nutrition plans')) {
    throw new Error('index.html meta description does not contain TheHealthyStitch')
  }
  console.log('✓ Meta description verified: mentions TheHealthyStitch')

  // Find JS bundle
  const assetsDir = path.join(distDir, 'assets')
  const files = fs.readdirSync(assetsDir)
  const jsFile = files.find((f) => f.endsWith('.js'))
  const cssFile = files.find((f) => f.endsWith('.css'))

  if (!jsFile || !cssFile) {
    throw new Error('Missing JS or CSS bundle in dist/assets/')
  }

  const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8')
  const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8')

  // Verify the 4 Personalised Nutrition Programmes in the bundle
  console.log('\n--- 2. Verifying 4 Personalised Nutrition Programmes in Bundle ---')
  for (const prog of EXPECTED_PROGRAMMES) {
    if (!jsContent.includes(prog)) {
      throw new Error(`Programme missing from build: "${prog}"`)
    }
    console.log(`✓ Programme present: "${prog}"`)
  }

  // Verify key programme descriptors
  const descriptors = [
    'trial programme',
    'flagship programme',
    'extended guidance',
    'complete wellness programme',
  ]
  for (const desc of descriptors) {
    if (!jsContent.toLowerCase().includes(desc)) {
      throw new Error(`Programme descriptor missing: "${desc}"`)
    }
    console.log(`✓ Programme descriptor verified: "${desc}"`)
  }

  // Verify all 14 categories are in the JS bundle
  console.log('\n--- 3. Verifying All 14 Health Categories in Bundle ---')
  for (const cat of EXPECTED_CATEGORIES) {
    if (!jsContent.includes(cat)) {
      throw new Error(`Health category missing from build: "${cat}"`)
    }
    console.log(`✓ Category present: "${cat}"`)
  }

  // Verify Dietary Preferences
  console.log('\n--- 4. Verifying Dietary Preference Options ---')
  for (const diet of EXPECTED_DIET_OPTIONS) {
    if (!jsContent.includes(diet)) {
      throw new Error(`Dietary preference missing: "${diet}"`)
    }
    console.log(`✓ Dietary preference present: "${diet}"`)
  }

  // Verify Consultation Times
  console.log('\n--- 5. Verifying Preferred Consultation Times ---')
  for (const time of EXPECTED_TIME_OPTIONS) {
    if (!jsContent.includes(time)) {
      throw new Error(`Consultation time missing: "${time}"`)
    }
    console.log(`✓ Consultation time present: "${time}"`)
  }

  // Verify Boxed UI CSS classes
  console.log('\n--- 6. Verifying Boxed UI & Architectural CSS Classes ---')
  const requiredClasses = [
    'plans-page',
    'programmes-grid',
    'prog-box',
    'prog-box--flagship',
    'prog-box__flagship-ribbon',
    'prog-box__compartment-head',
    'prog-box__compartment-body',
    'prog-box__compartment-ideal',
    'prog-box__compartment-foot',
    'prog-matrix',
    'enquiry__success-card',
    'admin-modal',
  ]

  for (const cls of requiredClasses) {
    if (!cssContent.includes(cls)) {
      throw new Error(`CSS class missing from bundle: ".${cls}"`)
    }
    console.log(`✓ Boxed UI class present: ".${cls}"`)
  }
}

async function testApiEndpointDirect() {
  console.log('\n--- 7. Verifying Enquiry Persistence API Middleware in config ---')
  const viteConfig = fs.readFileSync(path.resolve('./vite.config.js'), 'utf-8')
  if (!viteConfig.includes('enquiryApiPlugin') || !viteConfig.includes('/api/enquiries')) {
    throw new Error('Vite config missing enquiry API plugin middleware!')
  }
  console.log('✓ enquiryApiPlugin configured in vite.config.js')

  const storageHelper = fs.readFileSync(path.resolve('./src/lib/enquiryStorage.js'), 'utf-8')
  if (!storageHelper.includes('thehealthystitch_enquiries')) {
    throw new Error('Storage key thehealthystitch_enquiries missing in enquiryStorage.js!')
  }
  console.log('✓ Storage key thehealthystitch_enquiries configured')
}

async function run() {
  try {
    await testStaticBuild()
    await testApiEndpointDirect()
    console.log('\n========================================')
    console.log('ALL PROGRAMME & BOXED UI TESTS PASSED!')
    console.log('========================================')
    process.exit(0)
  } catch (err) {
    console.error('\nFAILED:', err)
    process.exit(1)
  }
}

run()
