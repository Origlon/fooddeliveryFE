export default function StepDots({ currentStep }) {
  return (
    <div className="mb-6 flex gap-2">
      <div
        className={`h-1.5 flex-1 rounded-full ${
          currentStep >= 1 ? "bg-[#6C5CE7]" : "bg-muted"
        }`}
      />

      <div
        className={`h-1.5 flex-1 rounded-full ${
          currentStep >= 2 ? "bg-[#6C5CE7]" : "bg-muted"
        }`}
      />
    </div>
  );
}
