export default function LoadingSpinner({ fullPage = true }) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#fff8f5] z-[9999]">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-4 border-[#dcc1b5] border-t-[#99420d] animate-spin"
          />
          <p className="text-sm font-semibold tracking-wider text-[#56433a]" style={{ letterSpacing: '0.05em' }}>
            Loading…
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-8 h-8 rounded-full border-4 border-[#dcc1b5] border-t-[#99420d] animate-spin" />
    </div>
  );
}
