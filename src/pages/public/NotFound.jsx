import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" description="This weave seems to have gone elsewhere." />
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <span className="eyebrow">404</span>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
          This weave seems to have gone elsewhere.
        </h1>
        <p className="mt-4 max-w-md text-muted">
          The page you're looking for may have moved or no longer exists.
        </p>
        <div className="mt-8 flex gap-4">
          <Button to="/shop">Explore Collection</Button>
          <Button to="/" variant="outline">Go Home</Button>
        </div>
      </Container>
    </>
  )
}
