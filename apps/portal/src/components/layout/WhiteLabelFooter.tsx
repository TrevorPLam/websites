type WhiteLabelFooterProps = {
  hideAgencyBranding: boolean;
  supportEmail?: string;
  hideSupportLink: boolean;
};

export function WhiteLabelFooter({ hideAgencyBranding, supportEmail, hideSupportLink }: WhiteLabelFooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-4">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 text-sm text-gray-500">
        <p>{hideAgencyBranding ? 'All rights reserved.' : 'Powered by Agency platform.'}</p>
        {!hideSupportLink && supportEmail ? <a className="hover:text-gray-700" href={`mailto:${supportEmail}`}>Support</a> : null}
      </div>
    </footer>
  );
}
