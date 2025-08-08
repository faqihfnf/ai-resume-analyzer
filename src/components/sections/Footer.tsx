import { Github, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex flex-col items-center justify-between bg-slate-950/90 p-4 md:flex-row">
      <div className="flex items-center gap-4">
        <p className="text-md text-center text-slate-200 sm:text-left">
          Created with ❤️{" "}
          <span className="text-md bg-gradient-to-br from-cyan-500 to-indigo-500 bg-clip-text font-extrabold text-transparent">
            Faqih Nur Fahmi
          </span>
        </p>
      </div>

      <div className="mb-4 text-center md:mb-0 md:text-left">
        <p className="text-sm text-slate-200">
          {new Date().getFullYear()} © All Rights Reserved.
        </p>
      </div>

      <div className="flex justify-center gap-4 sm:justify-end">
        <Link
          href="https://github.com/faqihfnf"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-opacity-75 bg-black-200 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-indigo-400 text-indigo-600 saturate-180 backdrop-blur-lg backdrop-filter hover:border-indigo-600 hover:bg-indigo-600 hover:text-white dark:border-slate-700"
        >
          <Github className="h-5 w-5" />
        </Link>
        <Link
          href="https://www.linkedin.com/in/faqih-nur-fahmi-b51bb1ab/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-opacity-75 bg-black-200 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-indigo-400 text-indigo-600 saturate-180 backdrop-blur-lg backdrop-filter hover:border-indigo-600 hover:bg-indigo-600 hover:text-white dark:border-slate-700"
        >
          <Linkedin className="h-5 w-5" />
        </Link>
        <Link
          href="https://youtube.com/@marifahid"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-opacity-75 bg-black-200 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-indigo-400 text-indigo-600 saturate-180 backdrop-blur-lg backdrop-filter hover:border-indigo-600 hover:bg-indigo-600 hover:text-white dark:border-slate-700"
        >
          <Youtube className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
