'use client';

import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import Link from 'next/link';
import { AiFillGithub, AiFillDiscord } from 'react-icons/ai';
import { marked } from 'marked';

interface Release {
  tag_name: string;
  body: string;
}

const owner: string = 'codeblitz97';
const repo: string = 'elyzen';

export default function Changelogs() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [open, setopen] = useState<boolean>(false);
  const [latestRelease, setLatestRelease] = useState<Release | null>(null);

  function closeModal() {
    if (latestRelease) {
      localStorage.setItem('version', latestRelease.tag_name);
    }
    setopen(false);
  }

  const ulExtension = {
    name: 'unorderedList',
    level: 'block',
    start(src: any) {
      // Check if the source starts with an unordered list
      return /^\s*[-+*]\s+.*/.test(src) ? 0 : -1;
    },
    tokenizer(src: any) {
      const rule = /^\s*(-|\+|\*)\s+(.*)/;
      const match = rule.exec(src);

      if (match) {
        const items = [{ type: 'text', raw: match[2].trim() }];
        return {
          type: 'unorderedList',
          raw: match[0],
          items,
        };
      }
    },
    renderer(token: any) {
      if (token.type === 'unorderedList') {
        let html = '<ul class="list-disc pl-4">';
        token.items.forEach((item: any) => {
          html += `<li class="mb-1">${marked.parseInline(item.raw)}</li>`;
        });
        html += '</ul>';
        return html;
      }
    },
  };

  async function fetchLatestRelease() {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/releases/latest`
      );
      const data: Release = await response.json();
      setLatestRelease(data);
    } catch (error) {
      console.error('Error fetching latest release:', error);
    }
  }

  function getVersion() {
    let version = localStorage.getItem('version');
    if (latestRelease && version !== latestRelease.tag_name) {
      setopen(true);
    }
  }

  useEffect(() => {
    fetchLatestRelease();
  }, []);

  useEffect(() => {
    getVersion();
  }, [latestRelease]);

  return (
    <>
      {latestRelease && (
        <Modal
          isOpen={open}
          onOpenChange={closeModal}
          backdrop='opaque'
          hideCloseButton={true}
          placement='center'
        >
          <ModalContent className='py-4'>
            {(onClose) => (
              <>
                <ModalBody>
                  <div className='flex flex-col'>
                    <div className='flex items-center justify-between gap-2'>
                      <p className='text-lg sm:text-xl'>Changelogs</p>
                      <div className='flex items-center gap-3'>
                        <Link
                          href={`https://github.com/${owner}/${repo}`}
                          target='_blank'
                          className='h-5 w-5 hover:opacity-75'
                        >
                          <AiFillGithub />
                        </Link>
                        <Link
                          href='https://discord.gg/8ynFhUQJbc'
                          target='_blank'
                          className='h-5 w-5 hover:opacity-75'
                        >
                          <AiFillDiscord />
                        </Link>
                      </div>
                    </div>
                    <div className='mt-4'>
                      <p className='text-sm text-gray-400'>
                        Hi there! 🎉 Welcome to the Changelogs section! 🌟 Here,
                        explore the latest updates made to the site! 🚀
                      </p>
                    </div>
                    <div className='my-3 flex flex-col items-center justify-evenly'>
                      <p className='font-inter mx-2 font-medium whitespace-nowrap'>
                        Version - {latestRelease.tag_name}
                      </p>
                      <div className='mt-1 h-[1px] w-full bg-white/10' />
                    </div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: marked
                          .use({ extensions: [ulExtension] })
                          .parse(latestRelease.body) as string,
                      }}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button className='rounded-lg' onPress={onClose}>
                    Dismiss
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
