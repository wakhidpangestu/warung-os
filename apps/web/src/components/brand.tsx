import { Store } from "lucide-react";
import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="WarungOS, beranda">
      <span className="brand-mark">
        <Store aria-hidden="true" size={18} />
      </span>
      <span>WarungOS</span>
    </Link>
  );
}
