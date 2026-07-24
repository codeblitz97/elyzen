'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image } from '@nextui-org/react';
import { XIcon, Download } from 'lucide-react';
import { saveAs } from 'file-saver';

export const ImageZoom = ({ src, alt }: { src: string; alt: string }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleZoom = () => setIsZoomed(!isZoomed);

  const handleScroll = () => {
    if (isZoomed) {
      setIsZoomed(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (isZoomed && event.key === 'Escape') {
      setIsZoomed(false);
    }
  };

  const handleDownload = () => {
    const name = src.split('/')[9];

    saveAs(
      `${process.env.NEXT_PUBLIC_CORS_PROXY_URL}/${src}`,
      name.includes('.') ? name : `${alt.replace(/s+/g, '-')}.jpg`
    );
  };

  useEffect(() => {
    if (isZoomed) {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isZoomed]);

  return (
    <>
      <Image
        src={src}
        className='max-h-[400px] cursor-pointer rounded-xl object-cover'
        alt={alt}
        width={300}
        height={500}
        isBlurred
        onClick={handleZoom}
      />

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className='fixed inset-0 z-[9372374] flex items-center justify-center bg-black bg-opacity-75'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleZoom}
          >
            <motion.div
              className='relative'
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={src}
                alt={alt}
                width={400}
                height={550}
                isBlurred
                className='max-h-[550px] rounded-xl object-cover'
              />
              <div className='flex gap-1'>
                <XIcon
                  className='absolute right-2 top-2 z-[9372371] h-8 w-8 cursor-pointer text-white'
                  onClick={handleZoom}
                />
                <Download
                  className='absolute right-10 top-2 z-[9372371] h-8 w-8 cursor-pointer text-white'
                  onClick={handleDownload}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
