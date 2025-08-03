import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="left z-50-0 fixed top-0 right-0 left-0 z-50 px-2">
      <div className="flex items-center py-2 backdrop-blur-sm">
        <Link href="/" className="group flex items-center">
          <Image
            src="/logo.png"
            alt="logo"
            width={70}
            height={70}
            className=""
          ></Image>
          <span className="mt-5 -ml-3.5 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 bg-clip-text text-4xl font-bold text-transparent">
            esumeaizer.
          </span>
        </Link>
      </div>
    </nav>
  );
}
