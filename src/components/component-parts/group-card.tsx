export const GroupCard = ({
  group,
}: {
  group: { groupName: string; currentWeek: string };
}) => {
  return (
    <div className="card bg-secondary max-h-50 text-secondary-content w-96 ">
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
