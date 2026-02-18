// [Task 0.22] Semantic tokens for theme compatibility (background, foreground, muted, border)

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        {/* Spinner placeholder shown during Suspense boundaries */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="w-20 h-20 border-4 border-border border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading copy keeps layout stable while pages hydrate */}
        <h2 className="text-xl font-semibold text-foreground mb-2">Loading...</h2>
        <p className="text-muted-foreground">Please wait while we prepare your content</p>
      </div>
    </div>
  );
}
