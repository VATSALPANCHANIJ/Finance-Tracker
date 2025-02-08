
"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
// "Dynamic Pages...."
const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="pt-30 pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
          Manage Your Money <br /> With AI
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
          The <strong> Money Management System </strong>tracks transactions, budgets, and subscriptions with <strong>AI-powered bill</strong> scanning and <strong>Google Gemini AI</strong>, offering <strong>
            personalized financial insights, automated reminders, and visual expense analysis</strong> for smarter money management.
        </p>
        <div className="my-2">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
            <Image
              src={"/financeAI.jpeg"}
              width={1280}
              height={720}
              alt="Finance + AI Banner Image"
              className="rounded-lg drop-shadow-2xl border mx-auto"
              priority
            ></Image>
          </div>
        </div>
      </div>
    </section>

  );
};

export default HeroSection;