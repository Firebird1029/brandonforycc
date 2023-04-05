import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";

export default function Home() {
	return (
		<>
			<Head>
				<title>Brandon Yee for YCC</title>
				<meta name="description" content="Brandon Yee for YCC" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="robots" content="noindex, nofollow" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={styles.main}>
				<p>hi</p>
			</main>
		</>
	);
}
