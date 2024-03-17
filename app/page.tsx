"use client";

import { useCompletion } from "ai/react";
import { useState, useCallback, useEffect, Fragment } from "react";

export default function PostEditorPage() {
  // Locally store our blog posts content
  const [content, setContent] = useState("");
  const [typos, setTypos] = useState([]);
  const { complete } = useCompletion({
    api: "/api/completion",
  });

  const check = useCallback(
    async (content: string) => {
      const completion = await complete(content);
      if (!completion) throw new Error("Failed to check typos");
      const typos = JSON.parse(completion);
      setTypos(typos);
    },
    [complete]
  );

  useEffect(() => {
    check(content);
  }, [check, content]);

  return (
    <div className="flex flex-col gap-6 text-left w-full pt-5 justify-center items-center">
      <h1 className="text-xl">Spellcheck</h1>
      <div className="w-5/12 h-[25dvh]">
        <textarea
          className="border w-full h-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        Typos:&nbsp;
        <br />
        {typos.map((typo, i) => (
          <Fragment key={typo}>
            {typo}
            {i + 1 < typos.length ? ", " : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
