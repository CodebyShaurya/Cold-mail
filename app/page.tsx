import ColdEmailGenerator from '@/components/ColdEmailGenerator';
import { Analytics } from "@vercel/analytics/next"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <ColdEmailGenerator />
      <Analytics />
    </main>
  );
}