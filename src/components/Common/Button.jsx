import Loader from "../Loader/Loader";

const Button = ({ type, title, isLoading }) => {
  return (
    <button
      type={type ? type : "button"}
      disabled={isLoading}
      className="button w-full relative flex items-center justify-center"
    >
      {isLoading ? <Loader /> : title}
    </button>
  );
};

export default Button;
