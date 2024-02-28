export function ProgressBar({
  totalAmount,
  completedAmount,
}: {
  totalAmount: number;
  completedAmount: number;
}) {
  const progressPercent = (completedAmount / totalAmount) * 100;
  const displayPercent = progressPercent.toFixed(0);

  return (
    <div className="border-primary-500 border-2 rounded-md h-10 bg-slate-400 mb-6 mx-3 min-w-20  ">
      <div
        className="bg-secondary-500 h-9 rounded-md text-center text-white"
        style={{ width: `${progressPercent}%` }}
      ></div>
      <p className="mb-2 text-lg mx-auto text-center">{displayPercent}%</p>
    </div>
  );
}
