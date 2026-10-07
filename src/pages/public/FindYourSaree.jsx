import { useState } from 'react'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import ProductGrid from '../../components/product/ProductGrid'
import Reveal from '../../components/common/Reveal'
import { listProducts } from '../../services/productService'
import { useAsync } from '../../hooks/useAsync'

// Guided client-side product finder. No AI — just scores existing products against the
// customer's answers and shows the best matches.
const STEPS = [
  {
    key: 'occasion',
    question: 'What are you shopping for?',
    options: ['Wedding', 'Festive', 'Celebration', 'Gift', 'Personal Collection'],
  },
  {
    key: 'colour',
    question: 'What colour speaks to you?',
    options: ['Purple', 'Green', 'Red', 'Pink', 'Blue', 'Black', 'Orange', 'Multicolor', 'No preference'],
  },
  {
    key: 'style',
    question: 'What style do you prefer?',
    options: ['Traditional', 'Statement', 'Minimal', 'Rich', 'Contemporary'],
  },
  {
    key: 'budget',
    question: 'What is your budget?',
    options: ['Under ₹20,000', '₹20,000–₹40,000', '₹40,000–₹75,000', '₹75,000+', 'No limit'],
  },
]

const BUDGET_RANGES = {
  'Under ₹20,000': [0, 20000],
  '₹20,000–₹40,000': [20000, 40000],
  '₹40,000–₹75,000': [40000, 75000],
  '₹75,000+': [75000, Infinity],
  'No limit': [0, Infinity],
}

function scoreProduct(p, answers) {
  let score = 0
  const occ = (p.occasion || []).join(' ').toLowerCase()
  if (answers.occasion && occ.includes(answers.occasion.toLowerCase())) score += 3
  if (answers.occasion === 'Gift' || answers.occasion === 'Personal Collection') score += 1 // flexible
  if (answers.colour && answers.colour !== 'No preference' && p.color === answers.colour) score += 3
  if (answers.style) {
    const text = [p.weave_type, p.border_type, p.name, p.short_description].join(' ').toLowerCase()
    const map = {
      Traditional: ['traditional', 'muniya', 'peacock'],
      Statement: ['designer', 'bold', 'tissue', 'brocade'],
      Minimal: ['single', 'semi'],
      Rich: ['triple', 'bridal', 'zari', 'pure silk'],
      Contemporary: ['designer', 'modern'],
    }
    if ((map[answers.style] || []).some((k) => text.includes(k))) score += 2
  }
  if (answers.budget) {
    const [min, max] = BUDGET_RANGES[answers.budget] || [0, Infinity]
    if (p.price >= min && p.price < max) score += 2
  }
  return score
}

export default function FindYourSaree() {
  const { data: products } = useAsync(() => listProducts(), [], [])
  const [stepIdx, setStepIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)

  const all = products || []

  function choose(key, value) {
    const next = { ...answers, [key]: value }
    setAnswers(next)
    if (stepIdx < STEPS.length - 1) setStepIdx(stepIdx + 1)
    else setDone(true)
  }

  function restart() {
    setAnswers({})
    setStepIdx(0)
    setDone(false)
  }

  const results = done
    ? [...all]
        .map((p) => ({ p, s: scoreProduct(p, answers) }))
        .sort((a, b) => b.s - a.s)
        .slice(0, 6)
        .map((x) => x.p)
    : []

  const step = STEPS[stepIdx]

  return (
    <>
      <Seo title="Find Your Saree" description="Answer a few questions and we'll curate a Paithani edit for your occasion, colour and budget." />

      <section className="border-b border-beige bg-cream py-16 text-center">
        <Container>
          <span className="eyebrow">Guided Discovery</span>
          <h1 className="mt-3 font-serif text-4xl font-light sm:text-5xl">Find Your Saree</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            A few quick questions, and we'll curate an edit that feels right.
          </p>
        </Container>
      </section>

      <Container className="py-16">
        {!done ? (
          <div className="mx-auto max-w-2xl">
            {/* progress */}
            <div className="mb-10 flex items-center justify-center gap-2">
              {STEPS.map((s, i) => (
                <span key={s.key} className={`h-1 w-10 rounded-full ${i <= stepIdx ? 'bg-wine' : 'bg-beige'}`} />
              ))}
            </div>

            <Reveal key={step.key} className="text-center">
              <span className="eyebrow">Step {stepIdx + 1} of {STEPS.length}</span>
              <h2 className="mt-3 font-serif text-3xl font-light">{step.question}</h2>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {step.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => choose(step.key, opt)}
                    className="border border-beige bg-ivory px-5 py-3 text-sm transition-colors hover:border-wine hover:text-wine"
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {stepIdx > 0 && (
                <button onClick={() => setStepIdx(stepIdx - 1)} className="mt-8 text-sm text-muted hover:text-wine">
                  ← Back
                </button>
              )}
            </Reveal>
          </div>
        ) : (
          <div>
            <div className="text-center">
              <span className="eyebrow">Your Paithani Edit</span>
              <h2 className="mt-3 font-serif text-3xl font-light">Curated for you</h2>
              <p className="mt-3 text-sm text-muted">
                {answers.occasion} · {answers.colour} · {answers.style} · {answers.budget}
              </p>
              <button onClick={restart} className="mt-4 text-sm text-wine hover:underline">Start over</button>
            </div>
            <div className="mt-12">
              {results.length > 0 ? (
                <ProductGrid products={results} />
              ) : (
                <p className="py-12 text-center text-muted">
                  No close matches — <a href="/shop" className="text-wine underline">browse the full collection</a>.
                </p>
              )}
            </div>
            <div className="mt-10 text-center">
              <Button to="/shop" variant="outline">Explore All Sarees</Button>
            </div>
          </div>
        )}
      </Container>
    </>
  )
}
