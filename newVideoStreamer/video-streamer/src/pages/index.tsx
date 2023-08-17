import Head from 'next/head';
import DataComponent from '../components/DataComponent';

export default function Home() {
    return (
        <div>
            <Head>
                <title>Next.js Polling App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1>Next.js Polling App</h1>
                <DataComponent />
            </main>

            <footer>
                <p>Powered by Next.js</p>
            </footer>
        </div>
    );
}
