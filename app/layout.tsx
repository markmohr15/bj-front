import { ApolloProvider } from '../lib/providers/ApolloProvider'
import { ReduxProvider } from '../lib/providers/ReduxProvider'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Layout from "../components/Layout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blackjack AI",
  description: "Advanced AI-powered Blackjack strategy and analysis tool",
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloProvider>
          <ReduxProvider>
            <Layout>{children}</Layout>
          </ReduxProvider>
        </ApolloProvider>
      </body>
    </html>
  );
};

export default RootLayout;


