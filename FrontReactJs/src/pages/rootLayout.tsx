import type { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Book app",
  description: "Find your book",
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Head>
        <title>{metadata.title?.toString()}</title>
        <meta name="description" content={metadata.description?.toString()} />
      </Head>
      {children}
    </>
  );
};

export default RootLayout;
