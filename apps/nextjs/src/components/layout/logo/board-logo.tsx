"use client";

import { useRequiredBoard } from "@homarr/boards/context";
import { useSettings } from "@homarr/settings";

import { earthropyWordmarkPath, homarrLogoPath } from "./constants";
import type { LogoWithTitleProps } from "./logo";
import { Logo, LogoWithTitle } from "./logo";

interface LogoProps {
  size: number;
}

const useImageOptions = () => {
  const board = useRequiredBoard();
  const { branding } = useSettings();
  return {
    src: board.logoImageUrl?.trim() || branding.logoImageUrl?.trim() || homarrLogoPath,
    alt: "Board logo",
    shouldUseNextImage: false,
  };
};

export const BoardLogo = ({ size }: LogoProps) => {
  const imageOptions = useImageOptions();
  return <Logo size={size} {...imageOptions} />;
};

interface CommonLogoWithTitleProps {
  size: LogoWithTitleProps["size"];
  hideTitleOnMobile?: boolean;
}

export const BoardLogoWithTitle = ({ size, hideTitleOnMobile }: CommonLogoWithTitleProps) => {
  const board = useRequiredBoard();
  const { branding } = useSettings();
  const imageOptions = useImageOptions();
  const hasCustomBrand = Boolean(board.logoImageUrl?.trim() || branding.logoImageUrl?.trim() || board.pageTitle);
  return (
    <LogoWithTitle
      wordmarkSrc={hasCustomBrand ? undefined : earthropyWordmarkPath}
      size={size}
      hideTitleOnMobile={hideTitleOnMobile}
      title={board.pageTitle ?? branding.appName}
      image={imageOptions}
    />
  );
};
