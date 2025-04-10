import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login'); // Auto-redirects to login page
}