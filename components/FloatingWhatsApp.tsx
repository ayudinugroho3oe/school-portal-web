import { SCHOOL_WHATSAPP_URL } from "../config/school-contact";
import WhatsAppIcon from "./WhatsAppIcon";

export default function FloatingWhatsApp() {
  return (
    <a
      href={SCHOOL_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat dengan sekolah melalui WhatsApp"
      className="group fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0F766E,#10B981)] text-white shadow-[0_14px_32px_rgba(16,185,129,0.3)] transition duration-300 ease-out hover:scale-105 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-3 sm:bottom-7 sm:right-7 sm:h-16 sm:w-16"
    >
      <span role="tooltip" className="pointer-events-none absolute right-full mr-3 hidden w-max max-w-[220px] rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">Ada yang ingin ditanyakan?</span>
      <WhatsAppIcon className="h-7 w-7 sm:h-8 sm:w-8" />
    </a>
  );
}
