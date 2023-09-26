import './globals.css';
import Image from 'next/image';
import Link from 'next/link';
import coffeeLogo from '../public/images/coffee-logo.png';

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/Products">Products</Link>
            {/* wäre cool wenn das so runterfahren könnte & schon die einzelnen produkte anzeigt */}
          </nav>
          <Image src={coffeeLogo} alt="store-logo" width={50} height={50} />
          {/* searchbar */}
          <Link href="/cart">Your cart</Link>
        </header>
        {children}
        <footer>2023</footer>
      </body>
    </html>
  );
}
