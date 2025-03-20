import { DataContext } from "@/contexts/dataContext";
import { useContext } from "react";
import { PiEye, PiEyeClosed } from "react-icons/pi";

export default function Eye() {
  const dataContext = useContext(DataContext);
  if (!dataContext) {
    throw new Error("DataContext must be used within a DataContextProvider");
  }
  const { visibleValues, setVisibleValues } = dataContext;

  const handleClick = () => {
    setVisibleValues((prevState) => !prevState);
  };

  return (
    <div
      onClick={handleClick}
      className="flex justify-center items-center p-2 bg-slate-900 w-10 h-10 rounded-full cursor-pointer transition-all duration-1000 ease-in-out"
    >
      <PiEye
        className={`absolute text-2xl transition-opacity transform ${
          visibleValues ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      />
      <PiEyeClosed
        className={`text-2xl transition-opacity transform ${
          visibleValues ? "opacity-0 scale-75" : "opacity-100 scale-100"
        }`}
      />
    </div>
  );
}
