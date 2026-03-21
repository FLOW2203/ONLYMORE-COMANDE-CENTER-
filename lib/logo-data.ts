import {
  LogoTypeInfo,
  ColorInfo,
  DesignPrinciple,
  LogoVariation,
  LogoQualityCheck,
} from '@/types/logo'

export const LOGO_TYPES: LogoTypeInfo[] = [
  {
    id: 'wordmark',
    label: 'Wordmark',
    description: 'Full brand name in custom typography',
    bestFor: 'Short, distinctive names (2-3 syllables); new brands needing name recognition',
    examples: 'Google, Coca-Cola, Visa',
  },
  {
    id: 'lettermark',
    label: 'Lettermark',
    description: 'Initials or monogram',
    bestFor: 'Long multi-word names; companies well-known by acronym',
    examples: 'IBM, HBO, NASA, CNN',
  },
  {
    id: 'pictorial',
    label: 'Pictorial Mark',
    description: 'Recognizable icon or symbol',
    bestFor: 'Established brands with strong recognition; global/multilingual audiences',
    examples: 'Apple, Twitter bird, Target',
  },
  {
    id: 'abstract',
    label: 'Abstract Mark',
    description: 'Unique geometric symbol',
    bestFor: 'Tech companies, innovative brands; when no literal icon fits',
    examples: 'Nike swoosh, Pepsi, Adidas',
  },
  {
    id: 'mascot',
    label: 'Mascot',
    description: 'Illustrated character',
    bestFor: 'Family/youth audiences; food, sports, entertainment brands',
    examples: 'KFC, Michelin, Pringles',
  },
  {
    id: 'emblem',
    label: 'Emblem',
    description: 'Text inside a symbol or badge',
    bestFor: 'Heritage brands, schools, government; premium/luxury positioning',
    examples: 'Starbucks, Harley-Davidson, NFL',
  },
  {
    id: 'combination',
    label: 'Combination Mark',
    description: 'Icon + wordmark together',
    bestFor: 'Most versatile; recommended for new brands needing both recognition paths',
    examples: 'Burger King, Lacoste, Doritos',
  },
]

export const COLOR_PSYCHOLOGY: ColorInfo[] = [
  { name: 'Red', hex: '#E53E3E', emotions: 'Energy, passion, urgency, appetite', industries: 'Food, retail, entertainment, sports', warning: 'Can signal danger or aggression' },
  { name: 'Orange', hex: '#ED8936', emotions: 'Creativity, enthusiasm, warmth, affordability', industries: 'Tech startups, food, youth brands', warning: 'Can look cheap if overused' },
  { name: 'Yellow', hex: '#ECC94B', emotions: 'Optimism, clarity, warmth, attention', industries: 'Food, children, energy, retail', warning: 'Low contrast on white; can signal caution' },
  { name: 'Green', hex: '#48BB78', emotions: 'Growth, health, nature, sustainability', industries: 'Eco, health, finance, agriculture', warning: 'Overused in "green" industries' },
  { name: 'Blue', hex: '#4299E1', emotions: 'Trust, security, professionalism, calm', industries: 'Tech, finance, healthcare, corporate', warning: 'Can feel cold or generic' },
  { name: 'Purple', hex: '#9F7AEA', emotions: 'Luxury, creativity, wisdom, mystery', industries: 'Beauty, luxury, spiritual, tech', warning: 'Can feel feminine; niche appeal' },
  { name: 'Pink', hex: '#ED64A6', emotions: 'Romance, youth, playfulness, modern', industries: 'Fashion, beauty, food, children', warning: 'Strong gender associations' },
  { name: 'Black', hex: '#1A202C', emotions: 'Luxury, sophistication, power, elegance', industries: 'Fashion, luxury, tech, automotive', warning: 'Can feel heavy or ominous' },
  { name: 'Gold', hex: '#D4A843', emotions: 'Premium, success, heritage, achievement', industries: 'Luxury, finance, awards, premium food', warning: 'Can look tacky if poorly executed' },
  { name: 'Teal', hex: '#0D7377', emotions: 'Balance, sophistication, uniqueness', industries: 'Health tech, hospitality, modern brands', warning: 'Less common = more distinctive' },
]

export const COLOR_HARMONIES = [
  { id: 'monochromatic' as const, label: 'Monochromatic', how: 'One hue, varying lightness/saturation', when: 'Elegant, minimalist brands' },
  { id: 'complementary' as const, label: 'Complementary', how: 'Opposite colors on the wheel', when: 'High contrast, energetic brands' },
  { id: 'analogous' as const, label: 'Analogous', how: 'Adjacent colors on the wheel', when: 'Harmonious, natural brands' },
  { id: 'triadic' as const, label: 'Triadic', how: 'Three equidistant colors', when: 'Vibrant, diverse brands' },
  { id: 'split-complementary' as const, label: 'Split-Complementary', how: 'One color + two adjacent to its complement', when: 'Balanced with contrast' },
]

export const DESIGN_PRINCIPLES: DesignPrinciple[] = [
  { id: 'simplicity', title: 'Simplicity', description: 'If you can\'t describe it in one sentence, simplify. Reduce elements until removing anything more would break the concept.' },
  { id: 'memorability', title: 'Memorability', description: 'A good logo can be drawn from memory after seeing it once. Test: describe the logo verbally. If someone can sketch it, it\'s memorable.' },
  { id: 'scalability', title: 'Scalability', description: 'Design at the smallest size first (16x16 favicon). If it reads clearly there, it will work everywhere. Vector (SVG) is mandatory.' },
  { id: 'versatility', title: 'Versatility', description: 'Must work in: full color, single color, black on white, white on black, on photos, on dark/light backgrounds.' },
  { id: 'timelessness', title: 'Timelessness', description: 'Avoid trends. Ask: "Will this look dated in 5 years?" If yes, strip the trend.' },
  { id: 'relevance', title: 'Relevance', description: 'The logo must feel appropriate for the industry and audience. Match the context.' },
  { id: 'originality', title: 'Originality', description: 'Never copy. Research competitors to ensure differentiation.' },
  { id: 'balance', title: 'Balance & Proportion', description: 'Use symmetry (or deliberate asymmetry). Apply the golden ratio (1:1.618) for sizing relationships.' },
  { id: 'typography', title: 'Typography Mastery', description: 'If the logo includes text, the typeface IS the design. Custom or semi-custom typography elevates a logo.' },
  { id: 'form-first', title: 'Form Before Color', description: 'Design in black and white first. Color enhances, it should not carry the design.' },
]

export const LOGO_VARIATIONS: LogoVariation[] = [
  { name: 'Primary (full color)', useCase: 'Default usage, hero placement', specs: 'SVG + PNG (1024px+)' },
  { name: 'Reversed (white)', useCase: 'Dark backgrounds', specs: 'SVG + PNG with transparency' },
  { name: 'Monochrome (black)', useCase: 'Print, fax, embossing, stamps', specs: 'SVG + PNG' },
  { name: 'Icon only', useCase: 'Favicon, app icon, social avatar', specs: 'SVG + PNG + ICO' },
  { name: 'Horizontal lockup', useCase: 'Website headers, email signatures', specs: 'SVG + PNG' },
  { name: 'Vertical / stacked', useCase: 'Social media profiles, merchandise', specs: 'SVG + PNG' },
]

export const LOGO_QUALITY_CHECKS: LogoQualityCheck[] = [
  { id: 'bw-test', category: 'design', label: 'Works in black & white (monochrome test passed)' },
  { id: 'favicon-test', category: 'design', label: 'Readable at 16x16 pixels (favicon test)' },
  { id: 'billboard-test', category: 'design', label: 'Maintains clarity at large sizes (billboard test)' },
  { id: 'color-limit', category: 'design', label: 'No more than 2-3 colors in the primary version' },
  { id: 'typography', category: 'design', label: 'Typography is custom or carefully selected (no default fonts)' },
  { id: 'negative-space', category: 'design', label: 'Negative space is intentional, not accidental' },
  { id: 'grid-system', category: 'design', label: 'Golden ratio or grid system applied for proportions' },
  { id: 'no-copyright', category: 'design', label: 'No copyrighted elements or trademarked symbols' },
  { id: 'personality', category: 'brand', label: 'Colors match the intended brand personality and industry' },
  { id: 'strategy', category: 'brand', label: 'Logo type matches the brand\'s strategic needs' },
  { id: 'audience', category: 'brand', label: 'Appropriate for the target audience' },
  { id: 'differentiated', category: 'brand', label: 'Differentiated from direct competitors' },
  { id: 'values', category: 'brand', label: 'Matches the stated brand values and positioning' },
  { id: 'clean-svg', category: 'technical', label: 'SVG file is clean (no unnecessary groups or metadata)' },
  { id: 'text-to-paths', category: 'technical', label: 'All text converted to paths (font-independent)' },
  { id: 'viewbox', category: 'technical', label: 'ViewBox is properly set' },
  { id: 'file-size', category: 'technical', label: 'File size optimized (under 20KB for simple logos)' },
  { id: 'hex-colors', category: 'technical', label: 'Colors use hex codes (not named colors)' },
  { id: 'full-color', category: 'deliverables', label: 'Primary full-color version delivered' },
  { id: 'mono-version', category: 'deliverables', label: 'Monochrome version delivered' },
  { id: 'reversed-version', category: 'deliverables', label: 'Reversed (white on dark) version delivered' },
  { id: 'icon-only', category: 'deliverables', label: 'Icon-only submark delivered' },
  { id: 'formats', category: 'deliverables', label: 'Multiple file formats provided (SVG + PNG minimum)' },
  { id: 'clear-space', category: 'deliverables', label: 'Clear space and minimum size documented' },
]

export const ONLYMORE_BRAND_COLORS: Record<string, { primary: string; secondary: string }> = {
  'ONLYMORE Group': { primary: '#0D7377', secondary: '#D4A843' },
  COLHYBRI: { primary: '#00D4AA', secondary: '#0D7377' },
  CROWNIUM: { primary: '#FFD700', secondary: '#1A202C' },
  'DOJUKU SHINGI': { primary: '#FF6B35', secondary: '#1A202C' },
  'ONLYMORE FINANCE': { primary: '#7B61FF', secondary: '#0D7377' },
}

export const TOOL_DECISION = [
  { condition: 'Geometric, abstract, lettermark, minimal', tool: 'SVG inline code', section: 'Code-precise' },
  { condition: 'Complex illustration, mascot, detailed emblem', tool: 'AI Image Generation', section: 'Gemini / Nano Banana Pro' },
  { condition: 'Quick professional logo with templates', tool: 'Canva MCP', section: 'generate-design' },
  { condition: 'Typography-focused wordmark', tool: 'SVG code + web fonts', section: 'Code with fonts' },
  { condition: 'Logo system with multiple variants', tool: 'SVG primary + Canva variations', section: 'Multi-tool' },
]

export const SIZE_GUIDE = [
  { context: 'Favicon', size: '16x16, 32x32, 48x48' },
  { context: 'App icon (iOS)', size: '1024x1024' },
  { context: 'App icon (Android)', size: '512x512' },
  { context: 'Social avatar', size: '400x400' },
  { context: 'Website header', size: '200px height max' },
  { context: 'Email signature', size: '150-200px width' },
  { context: 'Print (300 DPI)', size: 'Use vector (SVG/PDF)' },
]
