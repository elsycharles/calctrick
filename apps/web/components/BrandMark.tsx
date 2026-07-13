import Image from "next/image";

interface BrandMarkProps {
  readonly size?: number;
}

export function BrandMark({ size = 36 }: BrandMarkProps) {
  return (
    <Image
      className="shrink-0"
      src="/icons/calctrick-mark-v3-192.png"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      priority
      unoptimized
    />
  );
}
