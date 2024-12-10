import React from "react";
import Image from "next/image";

export default function CreateProfile() {
  return (
    <div className="flex flex-col justify-center font-[sans-serif] min-h-screen p-2">
      <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="Your Company"
            src="/assets/logo.png"
            width={120}
            height={120}
            className="mx-auto"
          />
          <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Complete your profile
          </h2>
        </div>
      </div>
    </div>
  );
}
