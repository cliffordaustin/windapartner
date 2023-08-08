import { ActionIcon, CopyButton, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import React, { useRef, useState, useEffect } from "react";

type ShareTypes = {
  property: string;
};

const Share = ({ property }: ShareTypes) => {
  const [facebookBtn, setFacebookBtn] = useState("");
  const [twitterBtn, setTwitterBtn] = useState("");
  const [whatsappBtn, setWhatsappBtn] = useState("");

  const formatLink = "https://www.safaripricer.com/partner/agent";

  useEffect(() => {
    const postUrl = encodeURI(location.href);
    const postTitle = `Calculate your contract prices on ${property} with SafariPricer: ${postUrl}`;

    setFacebookBtn(`https://www.facebook.com/sharer/sharer.php?u=${postTitle}`);
    setTwitterBtn(`https://twitter.com/share?text=${postTitle}`);
    setWhatsappBtn(`https://api.whatsapp.com/send?text=${postTitle}`);
  }, []);

  return (
    <div className="px-4">
      <div className="flex items-center gap-1 px-3 py-2 rounded-md bg-gray-100">
        <div className="text-sm font-bold truncate">{formatLink}</div>
        <CopyButton value={formatLink} timeout={2000}>
          {({ copied, copy }) => (
            <Tooltip
              label={copied ? "Copied" : "Copy"}
              withArrow
              position="right"
            >
              <ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
                {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </div>
      <div className="flex flex-col mt-6">
        <div className="font-bold">Or, Share This Home Via:</div>
        <div className="flex gap-6 justify-center items-center mt-4">
          <a
            rel="noreferrer"
            href={whatsappBtn}
            target="_blank"
            className="w-12 h-12 rounded-full shadow-xl bg-white flex justify-center items-center cursor-pointer"
          >
            <svg
              width="32px"
              height="32px"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              viewBox="0 0 24 24"
            >
              <title>WhatsApp</title>
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                fill="#25D366"
              />
            </svg>
          </a>
          <a
            rel="noreferrer"
            href={twitterBtn}
            target="_blank"
            className="w-12 h-12 rounded-full shadow-xl bg-white flex justify-center items-center cursor-pointer"
          >
            <svg
              width="32px"
              height="32px"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              viewBox="0 0 24 24"
            >
              <title>Twitter</title>
              <path
                d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                fill="#1DA1F2"
              />
            </svg>
          </a>
          <a
            rel="noreferrer"
            href={facebookBtn}
            target="_blank"
            className="w-12 h-12 rounded-full shadow-xl bg-white flex justify-center items-center cursor-pointer"
          >
            <svg
              width="32px"
              height="32px"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 32 32"
            >
              <path
                d="M23.446 18l.889-5.791h-5.557V8.451c0-1.584.776-3.129 3.265-3.129h2.526V.392S22.277.001 20.085.001c-4.576 0-7.567 2.774-7.567 7.795v4.414H7.431v5.791h5.087v14h6.26v-14z"
                fill="#6681eb"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Share;
