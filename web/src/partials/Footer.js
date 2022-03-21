import React from 'react';
import { AcademicCapIcon, ArchiveIcon, AtSymbolIcon, ChatAlt2Icon, SparklesIcon, ViewGridIcon } from '@heroicons/react/outline';

const whitePaperUrl = 'https://s3.eu-central-1.amazonaws.com/com.nomaguild.public/NoMA-whitepaper-version-1.2.pdf';

function Footer() {
  return (
    <footer className="max-w-6xl mx-auto">
      <div className="flex flex-row mx-auto items-center">
        <img src={require('../images/NoMA-wtext.svg').default} width="174" alt="Logo" className="mx-auto" />
      </div>
      <div className="max-w-6xl py-12 md:py-16 -mt-px mx-auto">
        <ul className="flex justify-end flex-grow items-center">
          <li>
            <a 
              target="_blank" rel="noreferrer" className="text-yellow-400 font-bold ml-6"
              href="/#/public-mint">
              <SparklesIcon className="h-5 w-5 mr-2 inline" />
              Mint
            </a>
          </li>
          <li>
            <a 
              target="_blank" rel="noreferrer" className="text-white font-bold ml-6"
              href="https://discord.gg/MzBjpdgxfu">
              <ChatAlt2Icon className="h-5 w-5 mr-2 inline" />
              Discord
            </a>
          </li>
          <li>
            <a href={whitePaperUrl} target="_blank" rel="noreferrer" className="text-white font-bold ml-6">
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
            <a href="https://twitter.com/nomaguild" target="_blank" rel="noreferrer" className="text-white font-bold ml-6">
              <AtSymbolIcon className="h-5 w-5 mr-1 inline" />
              Twitter
            </a>
          </li>
          <li>
            <a href="https://opensea.io/collection/nomaguild" target="_blank" rel="noreferrer" className="text-blue-600 font-bold ml-6">
              <ViewGridIcon className="h-5 w-5 mr-1 inline" />
              Opensea
            </a>
          </li>
        </ul>
      </div>
      <div className="text-gray-200 text-center text-sm mb-20">
        All rights reserved &copy; 2022 NoMA team
      </div>
    </footer>
  );
}

export default Footer;
