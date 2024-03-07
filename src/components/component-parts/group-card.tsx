export const GroupCard = ({
  group,
}: {
  group: { groupName: string; currentWeek: string };
}) => {
  return (
    <div className="card bg-secondary max-h-50 border-secondary border-4  hover:border-6 hover:border-primary text-secondary-content w-96 ">
      <div className="card-body">
        <h2 className="card-title">{group.groupName}</h2>
        <p>{group.currentWeek} weeks for this Group remaining</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Visit Now</button>
        </div>
      </div>
    </div>
  );
};
