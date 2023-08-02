import About from "@/components/Homepage/About";
import { useScrollIntoView } from "@mantine/hooks";
import React from "react";

function AboutPage() {
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });

  return (
    <div>
      <About targetRef={targetRef} />
    </div>
  );
}

export default AboutPage;
