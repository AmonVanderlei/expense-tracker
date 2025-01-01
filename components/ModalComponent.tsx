import { Dispatch, SetStateAction } from "react";

interface Props {
  show: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}

export default function Modal({ show, onClose, children }: Props) {
  return (
    <div
      style={{
        transform: show ? "translateY(0%)" : "translateY(200%)",
      }}
      className="fixed w-full h-full z-10 transition-all duration-500"
    >
      <div className="mx-auto max-w-2xl h-[100vh] bg-slate-800 py-6 px-4">
        <div className="w-full flex items-center justify-end">
        <button
          onClick={() => {
            onClose(false);
          }}
          className="font-bold rounded-lg bg-red-500 p-2 text-center"
        >
          Close
        </button></div>
        {children}
      </div>
    </div>
  );
}
