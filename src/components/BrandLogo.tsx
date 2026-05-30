interface BrandLogoProps {
  className?: string;
  height?: number;
}

const LOGO_ASPECT = 1024 / 682;

export default function BrandLogo({ className, height = 36 }: BrandLogoProps) {
  return (
    <img
      src="/digipros-logo.png"
      alt="DigiPros Marketing"
      className={className}
      height={height}
      width={Math.round(height * LOGO_ASPECT)}
      decoding="async"
      style={{ width: 'auto', height, display: 'block' }}
    />
  );
}
