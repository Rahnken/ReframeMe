import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className=" p-8 rounded-3xl my-5 w-3/4 mx-auto flex flex-col items-center">
      <h1 className="text-3xl p-4 font-headers"> Welcome to Reframe Me </h1>
      <p className="text-xl font-body ">
        Reframe Me is a comprehensive personal development application designed
        to foster alignment and focus on an individual's goals across various
        domains of life, namely physical, emotional, and financial wellness. The
        core philosophy behind Reframe Me is the belief that small, consistent
        steps can lead to profound and lasting changes. This is done through a
        structured framework of 12-week cycles, which breaks down the
        overwhelming process of goal achievement into manageable segments,
        encouraging users to set and pursue incremental goals that cumulatively
        lead to significant shifts in habits and life outcomes over a year.
      </p>
      <div className="flex content-between">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl p-3 font-headers text-primary underline">
            {" "}
            If you are ready to start!{" "}
          </h2>
          <Link to="/register" className="btn btn-primary mx-auto">
            {" "}
            Sign up here
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl p-3 font-headers text-secondary underline">
            {" "}
            Ready to continue?{" "}
          </h2>
          <Link to="/login" className="btn btn-secondary mx-auto">
            {" "}
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
