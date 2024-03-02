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
    <div className="flex flex-col gap-1 mb-2 mx-3">
      <div className="border-primary-500 border-2 flex rounded-md h-10 bg-slate-200 w-full min-w-20 flex-grow-1 ">
        <div
          className="bg-secondary-500 h-9 rounded-md  "
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      <p className="text-lg text-slate-100 mx-auto ">{displayPercent}%</p>
    </div>
  );
}
