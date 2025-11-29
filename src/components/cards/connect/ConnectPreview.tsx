"use client";

import { motion } from "framer-motion";
import { useCellState } from "@/components/tesseract";
import Link from "next/link";

export const ConnectPreview = () => {
  const { isHovered, isLocked } = useCellState("connect");

  const links = [
    { name: "LINKEDIN", href: "https://www.linkedin.com/in/p4r1h/" },
    { name: "GITHUB", href: "https://github.com/P4R1H" },
    { name: "MAIL", href: "mailto:mail2parthgupta@gmail.com" },
  ];

  return (
    <div className="w-full h-full relative pointer-events-none overflow-hidden">
      {!isLocked && (
        <motion.div
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10,
          }}
          transition={{ 
            duration: 0,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute bottom-0 right-0 flex items-center gap-3 pointer-events-auto"
        >
          {links.map((link, i) => (
            <div key={link.name} className="flex items-center gap-3">
              <Link
                href={link.href}
                target={link.name === "MAIL" ? undefined : "_blank"}
                className="text-zinc-500 hover:text-zinc-100 text-xs font-mono tracking-wider transition-colors uppercase"
                onClick={(e) => e.stopPropagation()} 
              >
                {link.name}
              </Link>
              {i < links.length - 1 && (
                <span className="text-zinc-800 text-xs">/</span>
              )}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
