import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <nav className="left z-50-0 fixed top-0 right-0 left-0 z-50">
      <div className="flex items-center px-2 py-1 backdrop-blur-sm">
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
        <Button
          asChild
          className="mt-4.5 ml-auto bg-gradient-to-tl from-indigo-700 via-violet-600 to-purple-500 fill-white p-2 text-xs font-semibold text-white shadow-md transition-all duration-300 ease-in-out hover:bg-gradient-to-br sm:p-4 sm:text-xs"
        >
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://tally.so/r/3xWL4o"
          >
            Feedback
          </Link>
        </Button>
      </div>
    </nav>
  );
}
