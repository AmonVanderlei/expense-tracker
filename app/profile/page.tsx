import Link from "next/link";

export default function Profile() {
  return (
    <div className="grow">
      <p>Profile</p>
      <Link href={"/"}>Go back</Link>
    </div>
  );
}
