import Image from 'next/image';

type WhiteLabelHeaderProps = {
  portalName: string;
  logoUrl?: string | null;
};

export function WhiteLabelHeader({ portalName, logoUrl }: WhiteLabelHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3">
        {logoUrl ? (
          <Image src={logoUrl} alt={`${portalName} logo`} width={40} height={40} className="rounded" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded bg-primary text-sm font-semibold text-white">
            {portalName.slice(0, 1).toUpperCase()}
          </div>
        )}
        <p className="text-base font-semibold text-gray-900">{portalName}</p>
      </div>
    </header>
  );
}
