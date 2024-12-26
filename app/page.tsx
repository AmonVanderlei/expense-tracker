import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="">
        <p className="text-2xl">Home</p>
      </div>
      <Link href={"/reports"} className="underline">
        Reports
      </Link>
      <Link href={"/transactions"} className="underline">
        Transactions
      </Link>
      <Link href={"/profile"} className="underline">
        Profile
      </Link>
    </>
  );
}
