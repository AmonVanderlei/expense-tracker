import Link from "next/link";

export default function Transactions() {
  return (
    <div className="grow">
      <p>Transactions</p>
      <Link href={"/"}>Go back</Link>
    </div>
  );
}
