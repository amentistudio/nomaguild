import React from 'react';
import { AcademicCapIcon, ArchiveIcon, AtSymbolIcon } from '@heroicons/react/outline';

function Footer() {
  return (
    <footer className="max-w-6xl mx-auto">
      <div className="max-w-6xl py-12 md:py-16 -mt-px mx-auto">
          <ul className="flex justify-end flex-grow items-center">
            <li>
              <a href="https://nomaclub-public.s3.eu-central-1.amazonaws.com/NoMa-whitepaper-web.pdf" target="_blank" rel="noreferrer" className="text-yellow-400 font-bold ml-6">
                <AcademicCapIcon className="h-5 w-5 mr-2 inline" />
                Whitepaper
              </a>
            </li>
            <li>
              <a href="https://delightful-octopus-60f.notion.site/NoMA-Wiki-138fcb2696b342589d3ac8131ce7b2f2" target="_blank" rel="noreferrer" className="text-white font-bold ml-6">
                <ArchiveIcon className="h-5 w-5 mr-2 inline" />
                Wiki
              </a>
            </li>
            <li>
              <a href="https://twitter.com/nomaclub" target="_blank" rel="noreferrer" className="text-white font-bold ml-6">
                <AtSymbolIcon className="h-5 w-5 mr-1 inline" />
                Twitter
              </a>
            </li>
          </ul>
      </div>
      <div className="text-gray-200 text-center text-sm mr-4 mb-20">
        All rights reserved &copy; 2022 NoMA team
      </div>
    </footer>
  );
}

export default Footer;
