import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="left z-50-0 fixed top-0 right-0 left-0 z-50 px-2">
      <div className="flex items-center py-1 backdrop-blur-sm">
        <Link href="/" className="group flex items-center">
          <Image
            src="/logo.png"
            alt="logo"
            width={55}
            height={55}
            className=""
          ></Image>
          <span className="mt-4.5 -ml-2.5 bg-gradient-to-tl from-indigo-700 via-violet-600 to-purple-500 bg-clip-text fill-transparent text-3xl font-bold text-transparent">
            esumeaizer.
          </span>
        </Link>
      </div>
    </nav>
  );
}
