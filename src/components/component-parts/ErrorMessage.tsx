
const errorStyle =
    "text-red-600 text-l bg-neutral-400 p-2 rounded-lg border-2 border-red-600 ";

export const ErrorMessage = ({
    message,
    show,
  }: {
    message: string;
    show: boolean;
  }) => {
    return show ? <div className={errorStyle}>{message}</div> : <div></div>;
  };